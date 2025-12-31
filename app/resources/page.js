"use client"
import { useEffect, useState, Suspense } from "react";
import { Search, Filter, ExternalLink, Download, Bookmark, BookmarkCheck, ChevronUp, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from "@/lib/client";
import { useNotification } from "@/components/NotificationSystem";
import ConfirmModal from "@/components/ConfirmModal";
import UploadModal from "@/components/UploadModal";

// --- SUB-COMPONENTS ---

const ResourceCard = ({ res, idx, user, savedIds, upvotedIds, onUpvote, onSave, onDelete }) => {
  const colors = ['bg-soft-pink', 'bg-soft-green', 'bg-soft-blue'];
  const cardColor = colors[idx % colors.length];

  return (
    <div className="brutalist-card bg-white flex flex-col h-full group relative">
      <div className={`${cardColor} p-6 border-b-4 border-black relative overflow-hidden`}>
        <div className="flex justify-between items-start mb-4">
          <span className="category-tag bg-white bg-opacity-80">
            {res.category || 'RESOURCES'}
          </span>
          <button 
            onClick={() => onUpvote(res.id)}
            className={`flex items-center gap-1 px-3 py-1 border-2 border-black font-black text-xs transition-all z-10 ${upvotedIds.has(res.id) ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'}`}
          >
            <ChevronUp size={14} strokeWidth={4} />
            {res.upvote_count || 0}
          </button>
        </div>
        <h3 className="text-2xl min-h-16 group-hover:underline decoration-4 decoration-black">{res.title}</h3>
      </div>
      
      <div className="p-6 grow">
        <div className="flex justify-between items-center mb-6 font-mono text-[10px] uppercase font-bold text-gray-500">
          <span>BY {res.author_name || 'COMMUNITY'}</span>
          <span>{new Date(res.created_at).toLocaleDateString()}</span>
        </div>
        
        <div className="flex gap-3">
          <a href={res.storage_url} target="_blank" rel="noopener noreferrer" 
             className="grow brutalist-button py-3 px-4 text-sm flex items-center justify-center gap-2">
            {res.type === 'PDF' ? <Download size={18} /> : <ExternalLink size={18} />}
            {res.type === 'PDF' ? 'DOWNLOAD' : 'OPEN LINK'}
          </a>
          <button onClick={() => onSave(res.id)}
            className={`brutalist-button p-3 min-w-12 shadow-none hover:shadow-brutalist-sm transition-all ${savedIds.has(res.id) ? 'bg-yellow-400' : 'bg-white'}`}>
            {savedIds.has(res.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
          {user?.id === res.author_id && (
            <button onClick={() => onDelete(res)}
              className="brutalist-button p-3 min-w-12 shadow-none hover:bg-red-500 hover:text-white transition-all bg-white">
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN CONTENT ---

function ResourcesContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || "All");
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const [upvotedIds, setUpvotedIds] = useState(new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  const { showNotification } = useNotification();

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
    if (session) {
      setUser(session.user);
      const { data: saves } = await supabase.from('saved_resources').select('resource_id').eq('user_id', session.user.id);
      if (saves) setSavedIds(new Set(saves.map(s => s.resource_id)));
      const { data: upvotes } = await supabase.from('resource_upvotes').select('resource_id').eq('user_id', session.user.id);
      if (upvotes) setUpvotedIds(new Set(upvotes.map(u => u.resource_id)));
    }
    const { data: allResources } = await supabase.from('resources').select('*').order('upvote_count', { ascending: false });
    if (allResources) setResources(allResources);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const sub = supabase.channel('resources').on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, (payload) => {
      if (payload.eventType === 'UPDATE') setResources(p => p.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r));
      else if (payload.eventType === 'DELETE') setResources(p => p.filter(r => r.id !== payload.old.id));
      else if (payload.eventType === 'INSERT') setResources(p => p.some(r => r.id === payload.new.id) ? p : [payload.new, ...p]);
    }).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'PDF' && deleteTarget.storage_url) {
        const path = new URL(deleteTarget.storage_url).pathname.split('/storage/v1/object/public/resources/')[1];
        if (path) await supabase.storage.from('resources').remove([path]);
      }
      const { error } = await supabase.from('resources').delete().eq('id', deleteTarget.id);
      if (!error) {
        showNotification("Deleted from vault", "success");
        setResources(p => p.filter(r => r.id !== deleteTarget.id));
      }
    } catch (e) { console.error(e); }
    setDeleteTarget(null);
  };

  const handleUpvote = async (id) => {
    if (!isLoggedIn) return router.push("/login");
    const upvoted = upvotedIds.has(id);
    setResources(p => p.map(r => r.id === id ? { ...r, upvote_count: upvoted ? r.upvote_count - 1 : r.upvote_count + 1 } : r));
    setUpvotedIds(p => { const n = new Set(p); upvoted ? n.delete(id) : n.add(id); return n; });
    if (upvoted) await supabase.from('resource_upvotes').delete().eq('user_id', user.id).eq('resource_id', id);
    else await supabase.from('resource_upvotes').insert({ user_id: user.id, resource_id: id });
  };

  const handleSave = async (id) => {
    if (!isLoggedIn) return router.push("/login");
    const saved = savedIds.has(id);
    const { error } = saved ? await supabase.from('saved_resources').delete().eq('user_id', user.id).eq('resource_id', id)
                            : await supabase.from('saved_resources').insert({ user_id: user.id, resource_id: id });
    if (!error) setSavedIds(p => { const n = new Set(p); saved ? n.delete(id) : n.add(id); return n; });
  };

  const categories = ["All", ...new Set(resources.map(r => r.category).filter(Boolean))];
  const filtered = resources.filter(r => {
    const s = searchTerm.toLowerCase();
    const match = r.title.toLowerCase().includes(s) || (r.description?.toLowerCase().includes(s)) || (r.category?.toLowerCase().includes(s));
    return match && (activeCategory === "All" || r.category === activeCategory);
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse italic">SYNCING VAULT...</div>;

  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 md:px-8 max-w-7xl mx-auto py-10 md:py-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl italic font-black uppercase tracking-tighter leading-none mb-4">THE RESOURCE VAULT</h1>
            <p className="font-bold text-gray-600 max-w-md">Browse verified placement materials from the community.</p>
          </div>
          <div className="flex flex-col gap-4 w-full md:max-w-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative grow">
                <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white border-4 border-black p-4 font-bold outline-none shadow-brutalist-sm focus:bg-accent/5" />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowFilters(!showFilters)} className={`border-4 border-black p-4 shadow-brutalist-sm hover:shadow-brutalist transition-all ${showFilters ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  <Filter size={20} />
                </button>
                {isLoggedIn && <button onClick={() => setIsUploadModalOpen(true)} className="brutalist-button bg-yellow-400 px-6 hidden sm:block">+ CONTRIBUTE</button>}
              </div>
            </div>
            {showFilters && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 border-2 border-black font-black text-xs uppercase tracking-wider transition-all ${activeCategory === cat ? 'bg-black text-white' : 'bg-white hover:bg-black/5 shadow-brutalist-sm'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
            {isLoggedIn && <button onClick={() => setIsUploadModalOpen(true)} className="brutalist-button bg-yellow-400 w-full py-4 sm:hidden">+ CONTRIBUTE</button>}
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((res, i) => (
            <ResourceCard key={res.id} res={res} idx={i} user={user} savedIds={savedIds} upvotedIds={upvotedIds} 
              onUpvote={handleUpvote} onSave={handleSave} onDelete={setDeleteTarget} />
          ))}
          {!filtered.length && (
            <div className="col-span-full border-4 border-dashed border-gray-200 p-20 text-center">
              <p className="text-3xl font-black text-gray-300 uppercase italic">No matches found</p>
              <button onClick={() => {setSearchTerm(""); setActiveCategory("All")}} className="mt-8 brutalist-button bg-white px-8">CLEAR ALL</button>
            </div>
          )}
        </div>

        {!isLoggedIn && resources.length > 0 && (
          <div className="mt-20 text-center">
            <button onClick={() => router.push("/login")} className="brutalist-button text-xl md:text-2xl px-12 py-6 bg-white shrink-0">LOAD MORE MISSION DATA</button>
          </div>
        )}
      </div>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadSuccess={fetchData} />
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Resource" confirmText="DESTRUCT"
        message={`Delete "${deleteTarget?.title}" permanently?`} />
    </main>
  );
}

export default function Resources() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black italic">LOADING...</div>}>
      <ResourcesContent />
    </Suspense>
  );
}
