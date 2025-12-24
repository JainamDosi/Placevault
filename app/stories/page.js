import { Quote, Building2, Trophy, ArrowRight, User } from "lucide-react";

export default function Stories() {
  const stories = [
    {
      name: "Arjun Mehta",
      role: "SDE-1",
      company: "Google",
      quote: "The HLD visuals in the vault were a game changer for my system design rounds. I couldn't have cracked the L4 interview without the 'System Design Patterns' doc.",
      package: "45 LPA",
      color: "bg-soft-blue"
    },
    {
      name: "Sarah Jen",
      role: "Product Analyst",
      company: "Cred",
      quote: "The behavioral tracking sheet helped me organize my STAR stories perfectly. The HR round felt like a breeze because I had practiced every scenario from the vault.",
      package: "28 LPA",
      color: "bg-soft-pink"
    },
    {
      name: "Dev Patel",
      role: "Backend Engineer",
      company: "Razorpay",
      quote: "Found the exact DP roadmap I needed. Specifically the patterns on 1D vs 2D DP. PlaceVault cuts through the noise of YouTube tutorials.",
      package: "32 LPA",
      color: "bg-soft-green"
    },
    {
      name: "Ananya R.",
      role: "Full Stack Dev",
      company: "Atlassian",
      quote: "Honestly, just the 'Company Sheet' with deadlines saved me. I would have missed the off-campus drive if not for the alerts.",
      package: "52 LPA",
      color: "bg-soft-blue"
    },
    {
      name: "Rahul Verma",
      role: "Data Scientist",
      company: "Amazon",
      quote: "The SQL query vault is underrated. It covered 90% of what was asked in my OA and technical screening.",
      package: "35 LPA",
      color: "bg-soft-green"
    },
    {
      name: "Ishita Gupta",
      role: "Frontend Engineer",
      company: "Zomato",
      quote: "I used the React machine coding templates to practice. The 'Poll Widget' and 'Infinite Scroll' snippets are gold.",
      package: "24 LPA",
      color: "bg-soft-pink"
    }
  ];

  return (
    <main className="min-h-screen relative bg-white">

      <div className="px-4 md:px-8 max-w-7xl mx-auto py-12 md:py-24">
        {/* Header */}
        <header className="mb-20 text-center md:text-left">
          <div className="inline-block bg-[#F9CC18] px-4 py-1 border-2 border-black font-black uppercase tracking-widest text-sm mb-4 shadow-brutalist-sm transform -rotate-1">
            Hall of Fame
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-4 leading-none">
            SUCCESS STORIES
          </h1>
          <p className="text-lg md:text-xl font-bold text-gray-600 max-w-2xl">
            Real seniors. Real placements. Real feedback.
            <br className="hidden md:block" />
            See how the Vault is changing careers.
          </p>
        </header>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <div key={i} className={`brutalist-card ${story.color} p-8 flex flex-col relative group`}>
              
              {/* Quote Icon */}
              <div className="absolute -top-4 -right-4 bg-black text-white p-3 border-2 border-white shadow-lg transform group-hover:rotate-12 transition-transform">
                <Quote size={20} fill="white" />
              </div>

              {/* Message */}
              <div className="mb-8 grow">
                <p className="font-bold text-lg leading-relaxed italic">
                  "{story.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t-4 border-black pt-6">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">{story.name}</h3>
                      <div className="flex items-center gap-2 font-bold text-sm text-gray-700">
                        <Building2 size={14} />
                        <span>{story.role} @ {story.company}</span>
                      </div>
                   </div>
                   <div className="bg-white/50 px-2 py-1 border-2 border-black text-xs font-black uppercase">
                      {story.package}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-24 bg-black text-white p-8 md:p-12 border-4 border-black shadow-brutalist md:flex justify-between items-center relative overflow-hidden">
           <div className="relative z-10 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4">
                 READY TO BE NEXT?
              </h2>
              <p className="text-base md:text-lg font-bold text-gray-400 max-w-xl mx-auto md:mx-0">
                 Join 5,000+ students accessing the same resources that got these folks placed.
              </p>
           </div>
           <button className="mt-8 md:mt-0 w-full md:w-auto bg-[#F9CC18] text-black px-8 py-4 font-black uppercase italic text-lg md:text-xl border-4 border-white hover:bg-white hover:border-[#F9CC18] transition-colors relative z-10 flex items-center justify-center gap-2">
              Start Preparing <ArrowRight strokeWidth={3} />
           </button>
           
           {/* Decorative Background */}
           <Trophy className="absolute -bottom-10 -right-10 text-gray-800 w-64 h-64 opacity-20 transform rotate-12" />
        </div>

      </div>
    </main>
  );
}
