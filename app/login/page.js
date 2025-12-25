"use client";
import { useState } from "react";
import { createClient } from "@/lib/client";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth/callback",
      },
    });

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="brutalist-card bg-soft-blue p-6 md:p-12 max-w-md w-full text-center relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent rounded-full border-4 border-black -z-0 opacity-20"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
            WELCOME BACK
          </h1>
          <p className="font-bold text-gray-700 mb-10 uppercase tracking-widest text-[10px] md:text-sm">
            Enter the Vault to continue your prep journey
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-black text-white p-5 border-4 border-black font-black uppercase flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all shadow-brutalist active:translate-x-2 active:translate-y-2 active:shadow-none"
          >
            {loading ? (
              <span className="animate-pulse">LOADING...</span>
            ) : (
              <>
                <Chrome size={24} />
                Sign in with Google
              </>
            )}
          </button>

          <div className="mt-8 pt-8 relative">
            {/* Progress Bar Container */}
            <div className="absolute top-0 left-0 w-full h-1 bg-black/10 overflow-hidden">
               {loading && (
                 <div className="h-full bg-soft-green animate-[loading_1.5s_infinite_linear] w-1/3 shadow-[0_0_10px_rgba(0.5,0,0.2,0.5)]"></div>
               )}
            </div>
            
            <p className="text-[10px] font-black uppercase text-black/40 tracking-widest leading-relaxed">
              By joining, you agree to share your placement data with the community vault.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
