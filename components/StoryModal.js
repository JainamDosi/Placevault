"use client";
import { useState } from "react";
import { X, MessageSquare, Loader2, Trophy } from "lucide-react";
import { createClient } from "@/lib/client";
import { useNotification } from "@/components/NotificationSystem";

export default function StoryModal({ isOpen, onClose, onSuccess }) {
  const { showNotification } = useNotification();
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

      showNotification("Thank you for sharing your journey!", "success");
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
      showNotification(error.message || "Failed to share story", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="brutalist-card bg-white w-full max-w-2xl relative overflow-hidden max-h-[95vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 hover:bg-gray-100 transition-colors border-2 border-black z-10"
        >
          <X size={18} />
        </button>

        <div className="p-4 sm:p-6 md:p-12">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-yellow-400 p-2 sm:p-3 border-2 md:border-4 border-black shadow-brutalist-sm">
                <Trophy size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
              Share Your Journey
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block font-black uppercase text-xs tracking-widest mb-1.5 sm:mb-2 text-gray-500">Your Piece of Advice</label>
              <textarea 
                key="story-text"
                required
                rows="4"
                placeholder="What's the one thing that helped you crack the interview?" 
                value={formData?.text || ""}
                onChange={(e) => setFormData(prev => ({...prev, text: e.target.value}))}
                className="w-full bg-gray-50 border-2 md:border-4 border-black p-3 md:p-4 text-sm md:text-base font-bold focus:bg-yellow-50 focus:outline-none resize-none"
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-1.5 sm:mb-2 text-gray-500">Your Name</label>
                 <input 
                  key="story-name"
                  required
                  type="text" 
                  placeholder="Arjun Mehta" 
                  value={formData?.author_name || ""}
                  onChange={(e) => setFormData(prev => ({...prev, author_name: e.target.value}))}
                  className="w-full bg-gray-50 border-2 md:border-4 border-black p-3 md:p-4 text-sm md:text-base font-bold focus:bg-yellow-50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-1.5 sm:mb-2 text-gray-500">Target Role</label>
                <input 
                  key="story-role"
                  required
                  type="text" 
                  placeholder="e.g. SDE-1, Product Analyst" 
                  value={formData?.author_role || ""}
                  onChange={(e) => setFormData(prev => ({...prev, author_role: e.target.value}))}
                  className="w-full bg-gray-50 border-2 md:border-4 border-black p-3 md:p-4 text-sm md:text-base font-bold focus:bg-yellow-50 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label className="block font-black uppercase text-xs tracking-widest mb-1.5 sm:mb-2 text-gray-500">Company Name</label>
                <input 
                  key="story-company"
                  required
                  type="text" 
                  placeholder="e.g. Google, Atlassian" 
                  value={formData?.author_company || ""}
                  onChange={(e) => setFormData(prev => ({...prev, author_company: e.target.value}))}
                  className="w-full bg-gray-50 border-2 md:border-4 border-black p-3 md:p-4 text-sm md:text-base font-bold focus:bg-yellow-50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-1.5 sm:mb-2 text-gray-500">Package (Optional)</label>
                <input 
                  key="story-package"
                  type="text" 
                  placeholder="e.g. 45 LPA" 
                  value={formData?.package_info || ""}
                  onChange={(e) => setFormData(prev => ({...prev, package_info: e.target.value}))}
                  className="w-full bg-gray-50 border-2 md:border-4 border-black p-3 md:p-4 text-sm md:text-base font-bold focus:bg-yellow-50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-black uppercase text-xs tracking-widest mb-1.5 sm:mb-2 text-gray-500">LinkedIn URL (Optional)</label>
              <input 
                key="story-linkedin"
                type="url" 
                placeholder="https://linkedin.com/in/yourprofile" 
                value={formData?.linkedin_url || ""}
                onChange={(e) => setFormData(prev => ({...prev, linkedin_url: e.target.value}))}
                className="w-full bg-gray-50 border-2 md:border-4 border-black p-3 md:p-4 text-sm md:text-base font-bold focus:bg-yellow-50 focus:outline-none"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-black text-white border-2 md:border-4 border-black py-4 md:py-6 font-black uppercase tracking-widest text-base md:text-xl shadow-brutalist-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
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
