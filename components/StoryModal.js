"use client";
import { useState } from "react";
import { X, MessageSquare, Loader2, Trophy } from "lucide-react";
import { createClient } from "@/lib/client";

export default function StoryModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    author_name: "",
    author_role: "",
    author_company: "",
    package_info: "",
    linkedin_url: "",
  });
  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('advice')
        .insert({
          ...formData,
          user_id: session?.user?.id || null,
        });

      if (error) throw error;

      alert("Thank you for sharing your journey!");
      setFormData({
        text: "",
        author_name: "",
        author_role: "",
        author_company: "",
        package_info: "",
        linkedin_url: "",
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Story error:", error);
      alert(error.message || "Failed to share story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="brutalist-card bg-white w-full max-w-2xl relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors border-2 border-black"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-yellow-400 p-3 border-4 border-black shadow-brutalist-sm">
                <Trophy size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
              Share Your Journey
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Your Piece of Advice</label>
              <textarea 
                required
                rows="4"
                placeholder="What's the one thing that helped you crack the interview?" 
                value={formData.text || ""}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                className="w-full bg-gray-50 border-4 border-black p-4 font-bold focus:bg-yellow-50 focus:outline-none resize-none"
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Your Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Arjun Mehta" 
                  value={formData.author_name || ""}
                  onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                  className="w-full bg-gray-50 border-4 border-black p-4 font-bold focus:bg-yellow-50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Target Role</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. SDE-1, Product Analyst" 
                  value={formData.author_role || ""}
                  onChange={(e) => setFormData({...formData, author_role: e.target.value})}
                  className="w-full bg-gray-50 border-4 border-black p-4 font-bold focus:bg-yellow-50 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Company Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Google, Atlassian" 
                  value={formData.author_company || ""}
                  onChange={(e) => setFormData({...formData, author_company: e.target.value})}
                  className="w-full bg-gray-50 border-4 border-black p-4 font-bold focus:bg-yellow-50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Package (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 45 LPA" 
                  value={formData.package_info || ""}
                  onChange={(e) => setFormData({...formData, package_info: e.target.value})}
                  className="w-full bg-gray-50 border-4 border-black p-4 font-bold focus:bg-yellow-50 focus:outline-none"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-black text-white border-4 border-black py-6 font-black uppercase tracking-widest text-xl shadow-brutalist-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  POSTING...
                </>
              ) : (
                "Post to Advice Wall"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
