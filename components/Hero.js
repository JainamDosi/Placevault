import DotBackground from "./DotBackground";

export default function Hero() {
  return (
    <section className="px-8 py-12 md:py-20 text-center flex flex-col items-center relative overflow-hidden">
      
      <DotBackground />

      {/* Top Tag */}
      <div className="mb-8 relative inline-block z-10">
        <div className="bg-soft-pink border-2 border-black px-6 py-2 font-black uppercase text-sm md:text-base tracking-wide shadow-brutalist-sm transform -rotate-2">
          PLACEMENT SEASON IT IS!!
        </div>
      </div>

      <div className="max-w-5xl relative z-10 px-2 md:px-0">
        <h1 className="text-5xl md:text-8xl lg:text-9xl mb-6 md:mb-8 leading-[0.9] font-black italic tracking-tighter">
          <div>CRACK</div>
          <div className="relative inline-block mx-2">
             <span className="relative z-10 px-2 lg:px-4">INTERVIEWS</span>
             <div className="absolute inset-0 bg-[#F9CC18] -skew-x-6 border-2 md:border-4 border-black"></div>
          </div>
          <div>LIKE A PRO.</div>
        </h1>
        
        <p className="text-lg md:text-xl font-medium text-gray-800 mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate vault for DSA roadmaps, HR prep scripts, and verified company application sheets.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button className="bg-white text-black border-4 border-black px-8 py-4 font-black uppercase tracking-wider text-lg shadow-brutalist-sm hover:shadow-brutalist hover:-translate-y-1 transition-all">
            EXPLORE VAULT
          </button>
          <button className="bg-black text-white border-4 border-black px-8 py-4 font-black uppercase tracking-wider text-lg shadow-brutalist-sm hover:bg-accent hover:text-black hover:shadow-brutalist hover:-translate-y-1 transition-all">
            START PREPARING
          </button>
        </div>
      </div>
    </section>
  );
}
