"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { User, Award, BookOpen, Clock, Trash2 } from "lucide-react";
import UploadModal from "@/components/UploadModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useNotification } from "@/components/NotificationSystem";

export default function Dashboard() {
  const { showNotification } = useNotification();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedResources, setUploadedResources] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session.user);

    // Get count of uploaded resources
    const { count: uploadsCount } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', session.user.id);

    // Get IDs of user's uploaded resources
    const { data: userResources } = await supabase
      .from('resources')
      .select('id')
      .eq('author_id', session.user.id);

    const userResourceIds = userResources?.map(r => r.id) || [];

    // Count how many times OTHER users have saved this user's resources
    let totalSavesCount = 0;
    if (userResourceIds.length > 0) {
      const { count } = await supabase
        .from('saved_resources')
        .select('*', { count: 'exact', head: true })
        .in('resource_id', userResourceIds)
        .neq('user_id', session.user.id); // Exclude self-saves
      
      totalSavesCount = count || 0;
    }

    // Fetch the list of resources
    const { data: uploads } = await supabase
      .from('resources')
      .select('*')
      .eq('author_id', session.user.id)
      .order('created_at', { ascending: false });

    const { data: savings } = await supabase
      .from('saved_resources')
      .select('resources(*)')
      .eq('user_id', session.user.id);

    setUploadedResources(uploads || []);
    setSavedResources(savings?.map(s => s.resources).filter(Boolean) || []);

    setStats([
      { label: "Total Saves", value: totalSavesCount.toString(), icon: <Award className="text-yellow-500" />, color: "bg-soft-pink" },
      { label: "Contributions", value: (uploadsCount || 0).toString(), icon: <BookOpen className="text-blue-500" />, color: "bg-soft-blue" },
    ]);
    setLoading(false);
  };

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
        showNotification("Resource deleted successfully", "success");
        setUploadedResources(prev => prev.filter(r => r.id !== deleteTarget.id));
        fetchData(); // Update stats
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification("Error deleting resource", "error");
    }
    
    setDeleteTarget(null);
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // REALTIME SYNC FOR DASHBOARD
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-sync')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'resources',
        },
        (payload) => {
          // Remove from local uploaded list
          setUploadedResources(prev => prev.filter(r => r.id !== payload.old.id));
          // Remove from local saved list
          setSavedResources(prev => prev.filter(r => r.id !== payload.old.id));
          // Refresh stats to keep counts accurate
          setStats(currentStats => [
            currentStats[0], // Keep credits
            { ...currentStats[1], value: (parseInt(currentStats[1].value) - 1).toString() } // Decr contributions
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-4xl font-black animate-bounce italic uppercase tracking-tighter">
          LOADING VAULT...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24 py-12 md:py-20">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="relative inline-block mb-2">
            <div className="absolute inset-6 bg-soft-green -skew-x-6  h-1/2"></div>
            <h1 className="relative z-10 text-3xl md:text-5xl font-black !tracking-wider">
              Welcome to PlaceVault!!
            </h1>
          </div>
          <p className=" px-2 font-mono text-[10px] md:text-sm uppercase tracking-widest text-gray-500">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'PREP_USER'}
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className={`brutalist-card ${stat.color} p-8`}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white border-4 border-black p-2 shadow-brutalist-sm">
                  {stat.icon}
                </div>
                <span className="text-4xl font-black">{stat.value}</span>
              </div>
              <p className="font-bold uppercase italic text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Space */}
          <div className="lg:col-span-2">
            <div className="mb-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl italic">UPLOADED RESOURCES</h2>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="brutalist-button py-2 px-6 text-sm bg-yellow-400"
                >
                  + UPLOAD MORE
                </button>
              </div>
              <div className="space-y-6">
                {uploadedResources.map((item, i) => (
                  <div key={i} className="brutalist-card bg-white p-6 flex justify-between items-center group cursor-pointer hover:bg-yellow-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-black text-white p-3 border-2 border-black">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{item.title}</h4>
                        <p className="font-mono text-[10px] uppercase text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <a 
                        href={item.storage_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brutalist-button py-1 px-3 text-xs shadow-none group-hover:shadow-brutalist-sm"
                      >
                        OPEN
                      </a>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(item);
                        }}
                        className="p-2 text-red-600 hover:bg-black hover:text-white transition-colors border-2 border-black/5"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {uploadedResources.length === 0 && (
                  <div className="brutalist-card bg-gray-50 p-8 border-dashed text-center">
                    <p className="font-bold text-gray-400 uppercase">You haven't uploaded anything yet</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl mb-8 italic">SAVED RESOURCES</h2>
              <div className="space-y-6">
                {savedResources.map((item, i) => (
                  <div key={i} className="brutalist-card bg-white p-6 flex justify-between items-center group cursor-pointer hover:bg-blue-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-black text-white p-3 border-2 border-black">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{item.title}</h4>
                        <p className="font-mono text-[10px] uppercase text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <a 
                        href={item.storage_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brutalist-button py-1 px-3 text-xs shadow-none group-hover:shadow-brutalist-sm"
                      >
                        OPEN
                      </a>
                    </div>
                  </div>
                ))}
                {savedResources.length === 0 && (
                  <div className="brutalist-card bg-gray-50 p-8 border-dashed text-center">
                    <p className="font-bold text-gray-400 uppercase">No saved resources yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <h2 className="text-2xl md:text-3xl mb-8 italic">TOOLS</h2>
            <div className="space-y-6">
              <div className="brutalist-card bg-black text-white p-8">
                <h3 className="text-yellow-400 text-2xl mb-4 italic uppercase">CAREERBOT AI</h3>
                <p className="text-sm mb-6 text-gray-300 font-medium">
                  Stuck on a technical concept? Ask CareerBot for an instant explanation.
                </p>
                <button className="w-full bg-yellow-400 text-black border-2 border-white p-4 font-black uppercase italic hover:bg-white transition-colors">
                  START CHAT
                </button>
              </div>

              <div className="brutalist-card bg-white p-8 border-soft-blue border-8">
                <h3 className="text-xl mb-4 italic">SETTINGS</h3>
                <div className="space-y-2">
                  <button className="w-full text-left font-bold uppercase text-xs hover:underline decoration-4 decoration-accent">Profile Configuration</button>
                  <button className="w-full text-left font-bold uppercase text-xs hover:underline decoration-4 decoration-accent">Privacy & Security</button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left font-bold uppercase text-xs hover:underline decoration-4 decoration-accent text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        message={`Are you sure you want to remove "${deleteTarget?.title}" from the vault? This cannot be undone.`}
        confirmText="DESTRUCT"
      />
    </main>
  );
}
