import { Search, Filter, ExternalLink, Download, Clock } from "lucide-react";

export default function Resources() {
  const resources = [
    { title: "Amazon SDE-1 Interview Guide", category: "HR Script", type: "Docs", author: "PRIYA_SHARMA", date: "DEC 20, 2025", color: "bg-soft-pink" },
    { title: "Dynamic Programming Masterclass", category: "DSA Roadmap", type: "PDF", author: "CODE_NINJA", date: "DEC 18, 2025", color: "bg-soft-green" },
    { title: "Financial Services Tracker 2026", category: "Company Sheet", type: "Sheets", author: "PLACEMENT_OFFICER", date: "DEC 15, 2025", color: "bg-soft-blue" },
    { title: "Google Behavioral Questions", category: "HR Script", type: "Docs", author: "EX_GOOGLE_SDE", date: "DEC 10, 2025", color: "bg-soft-pink" },
    { title: "Graph Theory Condensed Notes", category: "DSA Roadmap", type: "PDF", author: "ALGO_WIZARD", date: "DEC 05, 2025", color: "bg-soft-green" },
    { title: "FinTech Hiring Pipeline", category: "Company Sheet", type: "Sheets", author: "DATA_ANALYST", date: "DEC 01, 2025", color: "bg-soft-blue" },
  ];

  return (
    <main className="min-h-screen">
      
      <div className="px-4 md:px-8 max-w-7xl mx-auto py-12 md:py-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl mb-4 italic font-black uppercase tracking-tighter">THE RESOURCE VAULT</h1>
            <p className="font-bold text-gray-600">Browse verified placement materials from the community.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
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
          </div>
        </header>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {resources.map((res, i) => (
            <div key={i} className="brutalist-card bg-white flex flex-col h-full group">
              <div className={`${res.color} p-6 border-b-4 border-black relative overflow-hidden`}>
                <span className="category-tag bg-white bg-opacity-80 mb-4 inline-block">
                  {res.category}
                </span>
                <h3 className="text-2xl min-h-[4rem] group-hover:underline decoration-4 decoration-black">
                  {res.title}
                </h3>
              </div>
              
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-center mb-6 font-mono text-[10px] uppercase font-bold text-gray-500">
                  <span>BY {res.author}</span>
                  <span>{res.date}</span>
                </div>
                
                <div className="flex gap-4">
                  <button className="flex-grow brutalist-button py-3 text-sm flex items-center justify-center gap-2">
                    {res.type === 'PDF' ? <Download size={18} /> : <ExternalLink size={18} />}
                    {res.type === 'PDF' ? 'DOWNLOAD' : 'OPEN LINK'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination/Load More */}
        <div className="mt-20 mb-20 text-center">
          <button className="brutalist-button text-2xl px-12 py-6 bg-white hover:bg-black hover:text-white transition-colors">
            LOAD MORE MISSION DATA
          </button>
        </div>
      </div>
    </main>
  );
}
