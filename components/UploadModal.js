"use client";
import { useState } from "react";
import { X, Upload, Link as LinkIcon, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { useNotification } from "@/components/NotificationSystem";

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "PDF",
    link: "",
  });
  const [file, setFile] = useState(null);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showNotification("Please login to contribute!", "error");
        return;
      }

      let storageUrl = formData.link;

      if (formData.type === "PDF" && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('resources')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('resources')
          .getPublicUrl(filePath);
        
        storageUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('resources')
        .insert({
          title: formData.title,
          category: formData.category,
          type: formData.type,
          storage_url: storageUrl,
          author_id: session.user.id,
          author_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        });

      if (insertError) throw insertError;

      showNotification("Resource shared successfully!", "success");
      setFormData({ title: "", category: "", type: "PDF", link: "" });
      setFile(null);
      onUploadSuccess?.();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      showNotification(error.message || "Failed to upload resource", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="brutalist-card bg-white text-black text-left w-full max-w-xl relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors border-2 border-black"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-3xl !font-black italic mb-8 uppercase tracking-tighter">
            Contribute to Vault
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Resource Title</label>
              <input 
                key="input-title"
                required
                type="text" 
                placeholder="e.g. Amazon Behavioral Prep" 
                value={formData?.title || ""}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                className="w-full bg-gray-50 border-4 border-black p-4 font-bold focus:bg-accent/10 focus:outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Category</label>
                <input 
                  key="input-category"
                  required
                  type="text" 
                  placeholder="e.g. DSA, HR Prep" 
                  value={formData?.category || ""}
                  onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                  className="w-full bg-gray-50 border-4 border-black p-4 font-bold focus:bg-accent/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Type</label>
                <select 
                  key="input-type"
                  className="w-full bg-gray-50 border-4 border-black p-4 font-bold focus:bg-accent/10 focus:outline-none appearance-none"
                  value={formData?.type || "PDF"}
                  onChange={(e) => setFormData(prev => ({...prev, type: e.target.value}))}
                >
                  <option value="PDF">PDF File</option>
                  <option value="Link">External Link</option>
                </select>
              </div>
            </div>

            {formData.type === "PDF" ? (
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Select PDF</label>
                <div className="relative">
                  <input 
                    required={formData.type === "PDF"}
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden" 
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="flex items-center gap-4 bg-gray-100 border-2 border-dashed border-black p-6 cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <div className="bg-black text-white p-2">
                       <Upload size={20} />
                    </div>
                    <span className="font-bold text-sm truncate">
                      {file ? file.name : "Choose PDF file..."}
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Resource Link</label>
                <div className="relative">
                  <input 
                    key="input-link"
                    required={formData.type === "Link"}
                    type="url" 
                    placeholder="https://..." 
                    value={formData?.link || ""}
                    onChange={(e) => setFormData(prev => ({...prev, link: e.target.value}))}
                    className="w-full bg-gray-50 border-4 border-black p-4 pl-12 font-bold focus:bg-accent/10 focus:outline-none"
                  />
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-yellow-400 text-black border-4 border-black py-6 font-black uppercase tracking-widest text-xl shadow-brutalist hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  UPLOADING...
                </>
              ) : (
                "Share Resource"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
