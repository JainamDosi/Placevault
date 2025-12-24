"use client";
import { useState } from "react";
import { Send, X, ShieldCheck } from "lucide-react";

export default function CareerBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey! I'm CareerBot. How can I help you prepare today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response for now (to be connected to API)
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: "I'm currently in 'Demo Mode'. Once the API key is set up, I'll be able to help you with technical and behavioral questions!" }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-accent border-4 border-black px-6 py-3 shadow-brutalist-sm flex items-center gap-3 hover:-translate-y-1 hover:shadow-brutalist transition-all"
        >
          <div className="text-black"><ShieldCheck size={20} fill="black" className="text-accent" /></div>
          <span className="font-black uppercase tracking-widest text-black">PREP AI</span>
        </button>
      ) : (
        <div className="brutalist-card bg-white w-80 md:w-96 flex flex-col h-[500px] overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
            <h3 className="font-black italic uppercase tracking-tighter flex items-center gap-2">
              <span className="bg-accent text-black p-1 rounded-sm">AI</span> CAREERBOT
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-accent">
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-[#f0f0f0] font-medium">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 border-2 border-black shadow-brutalist-sm ${msg.role === 'user' ? 'bg-soft-blue' : 'bg-white'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 border-2 border-black shadow-brutalist-sm animate-pulse">
                  <p className="text-sm">Typing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t-4 border-black bg-white flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-grow bg-[#F8F8F8] border-2 border-black p-2 text-sm font-bold focus:outline-none focus:bg-accent/10"
            />
            <button 
              onClick={handleSend}
              className="bg-black text-white p-2 border-2 border-black hover:bg-accent hover:text-black transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
