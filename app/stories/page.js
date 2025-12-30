"use client";
import { useEffect, useState } from "react";
import { Quote, Building2, Trophy, ArrowRight, User, Plus } from "lucide-react";
import { createClient } from "@/lib/client";
import StoryModal from "@/components/StoryModal";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('advice')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setStories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const getRandomColor = (i) => {
    const colors = ['bg-soft-blue', 'bg-soft-pink', 'bg-soft-green'];
    return colors[i % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-4xl font-black animate-bounce italic uppercase tracking-tighter">
          HEARING STORIES...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative bg-white">

      <div className="px-4 md:px-8 max-w-7xl mx-auto py-12 md:py-24">
        {/* Header */}
        <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="inline-block bg-[#F9CC18] px-4 py-1 border-2 border-black font-black uppercase tracking-widest text-sm mb-4 shadow-brutalist-sm transform -rotate-1">
              Real Advice
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-4 leading-none uppercase">
              Advice Wall
            </h1>
            <p className="text-lg md:text-xl font-bold text-gray-600 max-w-2xl">
              Real seniors. Real placements. Real advice.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="brutalist-button bg-yellow-400 py-4 px-8 text-xl flex items-center gap-3"
          >
            <Plus strokeWidth={4} /> SHARE YOUR STORY
          </button>
        </header>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <div key={story.id} className={`brutalist-card ${getRandomColor(i)} p-8 flex flex-col relative group`}>
              
              {/* Quote Icon */}
              <div className="absolute -top-4 -right-4 bg-black text-white p-3 border-2 border-white shadow-lg transform group-hover:rotate-12 transition-transform">
                <Quote size={20} fill="white" />
              </div>

              {/* Message */}
              <div className="mb-8 grow">
                <p className="font-bold text-lg leading-relaxed italic">
                  "{story.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t-4 border-black pt-6">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">{story.author_name}</h3>
                      <div className="flex items-center gap-2 font-bold text-sm text-gray-700">
                        <Building2 size={14} />
                        <span>{story.author_role} @ {story.author_company}</span>
                      </div>
                   </div>
                   {story.package_info && (
                    <div className="bg-white/50 px-2 py-1 border-2 border-black text-xs font-black uppercase">
                       {story.package_info}
                    </div>
                   )}
                </div>
              </div>
            </div>
          ))}
          {stories.length === 0 && (
            <div className="col-span-full brutalist-card bg-gray-50 p-20 text-center border-dashed">
              <p className="text-3xl font-black text-gray-400 tracking-tighter uppercase opacity-50">No stories shared yet. Be the first!</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-24 bg-black text-white p-8 md:p-12 border-4 border-accent  md:flex justify-between items-center relative overflow-hidden">
           <div className="relative z-10 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4">
                 WOULD LOVE TO HEAR YOU !
              </h2>
            
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="mt-8 md:mt-0 w-full md:w-auto bg-[#F9CC18] text-black px-8 py-4 font-black uppercase italic text-lg md:text-xl border-4 border-white hover:bg-white hover:border-[#F9CC18] transition-colors relative z-10 flex items-center justify-center gap-2"
           >
              SHARE YOUR STORY <ArrowRight strokeWidth={3} />
           </button>
           
           {/* Decorative Background */}
           <Trophy className="absolute -bottom-10 -right-10 text-yellow w-64 h-64 opacity-20 transform rotate-12" />
        </div>

      </div>

      <StoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchStories}
      />
    </main>
  );
}
