"use client";
import { useState, useEffect, useRef } from "react";
import { Send, X, ShieldCheck } from "lucide-react";
import { useChat } from "./ChatContext";

export default function CareerBot() {
  const { isChatOpen, setIsChatOpen } = useChat();
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey! I'm CareerBot. How can I help you prepare today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage] 
        }),
      });

      const data = await response.json();

      if (data.text) {
        setMessages((prev) => [...prev, { role: "bot", text: data.text }]);
      } else {
        throw new Error("No response");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: "SYSTEM ERROR! 💀 I've lost connection to the main vault. Try again shortly." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-100">
      {!isChatOpen ? (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-accent border-4 border-black px-4 md:px-6 py-2 md:py-3 shadow-brutalist-sm flex items-center gap-2 md:gap-3 hover:-translate-y-1 hover:shadow-brutalist transition-all"
        >
          <div className="text-black"><ShieldCheck size={20} fill="black" className="text-accent" /></div>
          <span className="font-black uppercase tracking-widest text-black text-xs md:text-sm">PREP AI</span>
        </button>
      ) : (
        <div className="brutalist-card bg-white w-[calc(100vw-2rem)] md:w-96 flex flex-col h-[500px] max-h-[calc(100vh-4rem)] overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
            <h3 className="font-black italic uppercase tracking-tighter flex items-center gap-2">
              <span className="bg-accent text-black p-1 rounded-sm">AI</span> CAREERBOT
            </h3>
            <button onClick={() => setIsChatOpen(false)} className="hover:text-accent">
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="grow p-4 overflow-y-auto space-y-4 bg-[#f0f0f0] font-medium scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 border-2 border-black shadow-brutalist-sm ${msg.role === 'user' ? 'bg-soft-blue' : 'bg-white'}`}>
                  <div className="text-sm space-y-2">
                    {msg.text.split('\n').map((line, lineIdx) => {
                      // Handle Bullet Points
                      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                        return <div key={lineIdx} className="flex gap-2"><span>•</span><span>{line.trim().substring(2)}</span></div>;
                      }
                      
                      // Handle Bold Text (replace **text** with <strong>text</strong>)
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={lineIdx}>
                          {parts.map((part, partIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>
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
              className="grow bg-[#F8F8F8] border-2 border-black p-2 text-sm font-bold focus:outline-none focus:bg-accent/10"
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
