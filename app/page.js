"use client";
import Hero from "@/components/Hero";
import CareerBot from "@/components/CareerBot";
import ContributeSection from "@/components/ContributeSection";
import { Search, FileText, Database, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/resources?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push('/resources');
    }
  };
  const prepResources = [
    {
      tag: "HR",
      title: "Ultimate Google HR Prep",
      desc: "Comprehensive doc containing common behavioral questions and STAR responses.",
      author: "PLACEMENT CELL",
      color: "bg-soft-pink",
      icon: <FileText size={18} />
    },
    {
      tag: "COMPANIES",
      title: "Product Company Tracker 2024",
      desc: "Google Sheet containing application links and deadlines for top startups.",
      author: "COMMUNITY LEAD",
      color: "bg-soft-blue",
      icon: <ShieldCheck size={18} />
    },
    {
      tag: "SYSTEM DESIGN",
      title: "Low Level Design Patterns",
      desc: "Visual PDF notes on SOLID principles and Common Design Patterns.",
      author: "TECH MENTOR",
      color: "bg-soft-green",
      icon: <Database size={18} />
    },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      <Hero />

      {/* Prep Vault Section */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase relative z-10">PREP VAULT</h2>
            <div className="absolute bottom-1 md:bottom-2 left-0 w-full h-3 md:h-4 bg-accent/60 z-0"></div>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-0 mt-6 md:mt-0 w-full md:w-auto shadow-brutalist-sm">
             <input 
                type="text" 
                placeholder="Search company or topic..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-4 border-black border-r-0 p-3 font-bold w-full md:w-72 focus:outline-none focus:bg-accent/10"
             />
             <button type="submit" className="bg-black text-white px-8 py-3 font-black uppercase border-4 border-black hover:bg-accent hover:text-black transition-colors">
                GO
             </button>
          </form>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {prepResources.map((res, i) => (
            <div key={i} className={`brutalist-card ${res.color} p-6 flex flex-col h-full relative group`}>
              
              <div className="flex justify-between items-center mb-6">
                <span className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-wider">
                  {res.tag}
                </span>
                <div className="bg-white/50 border-2 border-black p-2 shadow-sm rounded-sm">
                   {res.icon}
                </div>
              </div>

              <h3 className="text-2xl font-black leading-none mb-3 tracking-tight">{res.title}</h3>
              <p className="font-bold text-sm leading-relaxed mb-8 grow opacity-70">
                {res.desc}
              </p>

              <div className="pt-4 border-t-2 border-black/10 flex justify-between items-center mt-auto">
                <span className="text-[10px] uppercase font-black tracking-widest text-black/40">
                  BY {res.author}
                </span>
                <button className="bg-black text-white px-5 py-2 text-xs font-black uppercase hover:bg-white hover:text-black border-2 border-black transition-colors">
                  ACCESS
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Contribute Section */}
      <div className="mt-0">
        <ContributeSection />
      </div>

      {/* Floating CareerBot Assistant */}
      <CareerBot />
    </main>
  );
}
