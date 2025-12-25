"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import UploadModal from "./UploadModal";
import { Sparkles, ArrowRight } from "lucide-react";

export default function ContributeSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkUser();
  }, []);

  const handleContribute = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <section className="bg-black text-white py-12 md:py-32 px-4 md:px-8 relative overflow-hidden border-t-8 border-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <div className="bg-yellow-400 text-black px-4 py-1 border-2 border-black font-black uppercase tracking-widest text-sm mb-12 shadow-brutalist-sm transform -rotate-1">
          Community Driven
        </div>
        
        <h2 className="text-5xl md:text-9xl font-black italic tracking-tighter leading-none mb-10 max-w-4xl">
          CONTRIBUTE <br />
          <span className="text-yellow-400">KNOWLEDGE</span> <br />
          
        </h2>

        <p className="text-gray-400 text-lg md:text-2xl font-bold max-w-2xl leading-relaxed mb-16">
          Have a useful HR doc or a company tracking sheet? 
          Share it with the community and help fellow students crack their placements.
        </p>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl">
          <button 
            onClick={handleContribute}
            className="flex-grow bg-white text-black border-4 border-black p-8 font-black uppercase tracking-tighter text-3xl shadow-brutalist hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-4 group"
          >
            SHARE NOW <ArrowRight className="group-hover:translate-x-2 transition-transform" strokeWidth={4} />
          </button>
        </div>

        <div className="mt-20 flex items-center gap-4 text-gray-500 font-black uppercase tracking-widest text-xs">
          <Sparkles className="text-yellow-400" />
          <span>JOIN 500+ CONTRIBUTORS THIS MONTH</span>
          <Sparkles className="text-yellow-400" />
        </div>
      </div>

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUploadSuccess={() => {
          setIsModalOpen(false);
          router.push("/resources");
        }}
      />
    </section>
  );
}
