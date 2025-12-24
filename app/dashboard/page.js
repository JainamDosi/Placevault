import Navbar from "@/components/Navbar";
import { User, Award, BookOpen, Clock, Settings } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Prep Credits", value: "250", icon: <Award className="text-yellow-600" />, color: "bg-soft-green" },
    { label: "Contributions", value: "12", icon: <BookOpen className="text-blue-600" />, color: "bg-soft-blue" },
    { label: "Vault Rank", value: "#42", icon: <User className="text-pink-600" />, color: "bg-soft-pink" },
  ];

  const recentActivity = [
    { title: "DSA Roadmap - Amazon Special", date: "2 hours ago", status: "Verified" },
    { title: "HR Script: The Conflict Question", date: "Today", status: "Draft" },
    { title: "System Design Cheat Sheet", date: "Yesterday", status: "Under Review" },
  ];

  return (
    <main className="min-h-screen pb-24">
    
      
      <div className="px-8 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl mb-2">CAREER SEEKER DASHBOARD</h1>
          <p className="font-mono text-sm uppercase tracking-widest text-gray-500">Welcome back, PREP_USER_01</p>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className={`brutalist-card ${stat.color} p-8`}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white border-4 border-black p-2 shadow-brutalist-sm">
                  {stat.icon}
                </div>
                <span className="text-4xl font-black">{stat.value}</span>
              </div>
              <p className="font-bold uppercase italic text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Space */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl mb-8">MY PREP SPACE</h2>
            <div className="space-y-6">
              {recentActivity.map((item, i) => (
                <div key={i} className="brutalist-card bg-white p-6 flex justify-between items-center group cursor-pointer hover:bg-yellow-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-black text-white p-3 border-2 border-black">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{item.title}</h4>
                      <p className="font-mono text-[10px] uppercase text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`category-tag ${item.status === 'Verified' ? 'bg-soft-green' : 'bg-gray-100'}`}>
                      {item.status}
                    </span>
                    <button className="brutalist-button py-1 px-3 text-xs shadow-none group-hover:shadow-brutalist-sm">
                      OPEN
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="w-full border-4 border-dashed border-black p-8 font-black uppercase italic hover:bg-gray-50 transition-colors">
                + Upload New Material
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <h2 className="text-3xl mb-8">TOOLS</h2>
            <div className="space-y-6">
              <div className="brutalist-card bg-black text-white p-8">
                <h3 className="text-yellow-400 text-2xl mb-4 italic">CAREERBOT AI</h3>
                <p className="text-sm mb-6 text-gray-300 font-medium">
                  Stuck on a technical concept? Ask CareerBot for an instant explanation.
                </p>
                <button className="w-full bg-yellow-400 text-black border-2 border-white p-4 font-black uppercase italic hover:bg-white transition-colors">
                  START CHAT
                </button>
              </div>

              <div className="brutalist-card bg-white p-8 border-soft-blue border-8">
                <h3 className="text-xl mb-4 italic">SETTINGS</h3>
                <div className="space-y-2">
                  <button className="w-full text-left font-bold uppercase text-xs hover:underline decoration-4 decoration-accent">Profile Configuration</button>
                  <button className="w-full text-left font-bold uppercase text-xs hover:underline decoration-4 decoration-accent">Privacy & Security</button>
                  <button className="w-full text-left font-bold uppercase text-xs hover:underline decoration-4 decoration-accent text-red-500">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
