"use client"
import { useEffect, useState } from "react";
import { Search, Filter, ExternalLink, Download, Clock, Bookmark, BookmarkCheck, ChevronUp, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/client";
import { useNotification } from "@/components/NotificationSystem";
import ConfirmModal from "@/components/ConfirmModal";
import UploadModal from "@/components/UploadModal";

export default function Resources() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
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
      
      // Fetch saved resource IDs
      const { data: saves } = await supabase
        .from('saved_resources')
        .select('resource_id')
        .eq('user_id', session.user.id);
      
      if (saves) setSavedIds(new Set(saves.map(s => s.resource_id)));

      // Fetch upvoted resource IDs
      const { data: upvotes } = await supabase
        .from('resource_upvotes')
        .select('resource_id')
        .eq('user_id', session.user.id);
      
      if (upvotes) setUpvotedIds(new Set(upvotes.map(u => u.resource_id)));
    }

    // Fetch resources with their counts
    const { data: allResources } = await supabase
      .from('resources')
      .select('*')
      .order('upvote_count', { ascending: false });

    if (allResources) setResources(allResources);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // REALTIME SUBSCRIPTION
    const channel = supabase
      .channel('resource-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to ALL events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'resources',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setResources(prev => 
              prev.map(r => r.id === payload.new.id ? { ...r, upvote_count: payload.new.upvote_count } : r)
            );
          } else if (payload.eventType === 'DELETE') {
            setResources(prev => prev.filter(r => r.id !== payload.old.id));
          } else if (payload.eventType === 'INSERT') {
            setResources(prev => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      // If it's a PDF type, delete the file from storage first
      if (deleteTarget.type === 'PDF' && deleteTarget.storage_url) {
        // Extract the file path from the storage URL
        const url = new URL(deleteTarget.storage_url);
        const pathParts = url.pathname.split('/storage/v1/object/public/resources/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1]; // e.g., "user-id/filename.pdf"
          
          // Delete from storage
          const { error: storageError } = await supabase.storage
            .from('resources')
            .remove([filePath]);
          
          if (storageError) {
            console.error('Storage deletion error:', storageError);
            // Continue anyway to delete the database entry
          }
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) {
        showNotification("Error deleting resource: " + error.message, "error");
      } else {
        showNotification("Resource deleted from vault", "success");
        setResources(prev => prev.filter(r => r.id !== deleteTarget.id));
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification("Error deleting resource", "error");
    }
    
    setDeleteTarget(null);
  };

  const handleUpvote = async (resourceId) => {
    if (!isLoggedIn) {
      showNotification("Please login to upvote resources!", "error");
      router.push("/login");
      return;
    }

    const isUpvoted = upvotedIds.has(resourceId);
    
    // Optimistic Update
    setResources(prev => prev.map(r => 
      r.id === resourceId 
        ? { ...r, upvote_count: isUpvoted ? Math.max(0, r.upvote_count - 1) : r.upvote_count + 1 }
        : r
    ));
    setUpvotedIds(prev => {
      const next = new Set(prev);
      if (isUpvoted) next.delete(resourceId); else next.add(resourceId);
      return next;
    });

    if (isUpvoted) {
      await supabase.from('resource_upvotes').delete().eq('user_id', user.id).eq('resource_id', resourceId);
    } else {
      await supabase.from('resource_upvotes').insert({ user_id: user.id, resource_id: resourceId });
    }
  };

  const handleSave = async (resourceId) => {
    if (!isLoggedIn) {
      alert("Please login to save resources to your dashboard!");
      router.push("/login");
      return;
    }
    
    const isSaved = savedIds.has(resourceId);
    
    if (isSaved) {
      const { error } = await supabase
        .from('saved_resources')
        .delete()
        .eq('user_id', user.id)
        .eq('resource_id', resourceId);

      if (!error) {
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(resourceId);
          return next;
        });
      }
    } else {
      const { error } = await supabase
        .from('saved_resources')
        .insert({ user_id: user.id, resource_id: resourceId });

      if (!error) {
        setSavedIds(prev => {
          const next = new Set(prev);
          next.add(resourceId);
          return next;
        });
      }
    }
  };

  const getRandomColor = (i) => {
    const colors = ['bg-soft-pink', 'bg-soft-green', 'bg-soft-blue'];
    return colors[i % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-4xl font-black animate-bounce italic uppercase tracking-tighter">
          SYNCING VAULT...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      
      <div className="px-4 md:px-8 max-w-7xl mx-auto py-12 md:py-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl mb-4 italic font-black uppercase tracking-tighter">THE RESOURCE VAULT</h1>
            <p className="font-bold text-gray-600">Browse verified placement materials from the community.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative grow">
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full bg-white border-4 border-black p-4 font-bold focus:bg-accent/10 shadow-brutalist-sm"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="bg-white border-4 border-black p-4 shadow-brutalist-sm hover:shadow-brutalist transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
              <Filter />
            </button>
            {isLoggedIn && (
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="brutalist-button bg-yellow-400 px-6 whitespace-nowrap"
              >
                + CONTRIBUTE
              </button>
            )}
          </div>
        </header>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {resources.map((res, i) => (
            <div key={res.id} className="brutalist-card bg-white flex flex-col h-full group relative">
              <div className={`${getRandomColor(i)} p-6 border-b-4 border-black relative overflow-hidden`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="category-tag bg-white bg-opacity-80">
                    {res.category || 'RESOURCES'}
                  </span>
                  <button 
                    onClick={() => handleUpvote(res.id)}
                    className={`flex items-center gap-1 px-3 py-1 border-2 border-black font-black text-xs transition-all z-10 ${upvotedIds.has(res.id) ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'}`}
                  >
                    <ChevronUp size={14} strokeWidth={4} />
                    {res.upvote_count || 0}
                  </button>
                </div>
                <h3 className="text-2xl min-h-16 group-hover:underline decoration-4 decoration-black">
                  {res.title}
                </h3>
              </div>
              
              <div className="p-6 grow">
                <div className="flex justify-between items-center mb-6 font-mono text-[10px] uppercase font-bold text-gray-500">
                  <span>BY {res.author_name || 'COMMUNITY'}</span>
                  <span>{new Date(res.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={res.storage_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-grow brutalist-button py-3 px-4 text-sm flex items-center justify-center gap-2"
                  >
                    {res.type === 'PDF' ? <Download size={18} /> : <ExternalLink size={18} />}
                    {res.type === 'PDF' ? 'DOWNLOAD' : 'OPEN LINK'}
                  </a>
                  <button 
                    onClick={() => handleSave(res.id)}
                    className={`brutalist-button p-3 min-w-12 shadow-none hover:shadow-brutalist-sm transition-all ${savedIds.has(res.id) ? 'bg-yellow-400' : 'bg-white'}`}
                    title={savedIds.has(res.id) ? "Saved to Dashboard" : "Save to Dashboard"}
                  >
                    {savedIds.has(res.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                  </button>
                  {user?.id === res.author_id && (
                    <button 
                      onClick={() => setDeleteTarget(res)}
                      className="brutalist-button p-3 min-w-12 shadow-none hover:bg-red-500 hover:text-white transition-all bg-white"
                      title="Delete Resource"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {resources.length === 0 && (
            <div className="col-span-full brutalist-card bg-gray-50 p-12 text-center border-dashed">
              <p className="text-2xl font-black text-gray-400 tracking-tighter uppercase">No resources found in the vault yet.</p>
            </div>
          )}
        </div>

        {/* Pagination/Load More */}
        {!isLoggedIn && resources.length > 0 && (
          <div className="mt-20 mb-20 text-center">
            <button onClick={() => router.push("/login")} className="brutalist-button text-2xl px-12 py-6 bg-white hover:bg-black hover:text-white transition-colors">
              LOAD MORE MISSION DATA
            </button>
          </div>
        )}
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={fetchData}
      />

      <ConfirmModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action is permanent and cannot be undone.`}
        confirmText="DESTRUCT"
      />
    </main>
  );
}
