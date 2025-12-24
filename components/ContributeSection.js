export default function ContributeSection() {
  return (
    <section className="bg-black text-white py-12 md:py-24 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div>
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none mb-8">
            CONTRIBUTE <br />
            <span className="text-accent">KNOWLEDGE</span> <br />
            WIN CREDITS.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-md leading-relaxed">
            Have a useful HR doc or a company tracking sheet? 
            Share it with the community and unlock premium DSA templates.
          </p>
        </div>

        {/* Right Form */}
        <div className="relative">
            {/* Shadow Element */}
            <div className="absolute top-4 left-4 w-full h-full bg-gray-800 rounded-none z-0"></div>
            
            {/* Form Card */}
            <div className="relative z-10 bg-white text-black p-8 border-4 border-black">
                
                <div className="mb-6">
                    <label className="block font-black uppercase text-xs tracking-widest mb-2">Resource Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Amazon Behavioral Prep" 
                        className="w-full bg-[#333] text-white p-3 font-bold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block font-black uppercase text-xs tracking-widest mb-2">Category</label>
                        <input 
                            type="text" 
                            placeholder="e.g. DSA, HR Prep" 
                            className="w-full bg-[#333] text-white p-3 font-bold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <label className="block font-black uppercase text-xs tracking-widest mb-2">Resource Type</label>
                        <select className="w-full bg-[#333] text-white p-3 font-bold focus:outline-none focus:ring-2 focus:ring-accent appearance-none">
                            <option>PDF Upload</option>
                            <option>Link</option>
                            <option>Text</option>
                        </select>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block font-black uppercase text-xs tracking-widest mb-2">Select PDF</label>
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-400 p-2 flex items-center gap-2">
                        <button className="bg-gray-600 text-white px-3 py-1 text-xs font-bold uppercase">Choose File</button>
                        <span className="text-xs text-gray-500 font-mono">No file chosen</span>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block font-black uppercase text-xs tracking-widest mb-2">Description</label>
                    <textarea 
                        rows="3"
                        placeholder="Help others understand what's inside..." 
                        className="w-full bg-[#333] text-white p-3 font-bold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    ></textarea>
                </div>

                <button className="w-full bg-accent text-black border-4 border-black py-4 font-black uppercase tracking-widest text-lg shadow-brutalist-sm hover:translate-[2px] hover:shadow-none transition-all">
                    SHARE RESOURCE
                </button>

            </div>
        </div>

      </div>
    </section>
  );
}
