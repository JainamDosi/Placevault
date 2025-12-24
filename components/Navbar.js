"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="glass-nav px-4 md:px-8 py-4 mb-1 relative z-50">
      <div className="flex justify-between items-center">
        <Link href="/" className="group text-2xl md:text-3xl font-black italic tracking-tighter flex items-center gap-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-[#F9CC18] border-2 border-black transition-transform duration-300 ease-out group-hover:rotate-90 group-hover:scale-110 group-hover:rounded-sm"></div>
          <span>PLACE<span className="text-black">VAULT</span></span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-bold uppercase text-sm tracking-widest">
          <Link href="/resources" className="hover:text-accent transition-colors">Resources</Link>
          <Link href="/stories" className="hover:text-accent transition-colors">Success Stories</Link>
          <Link href="/dashboard" className="bg-black text-white border-2 border-black px-6 py-3 hover:bg-white hover:text-black hover:shadow-brutalist-sm transition-all">
            JOIN PREP
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-black border-t-2 shadow-brutalist py-8 flex flex-col gap-6 items-center font-bold uppercase tracking-widest text-lg">
          <Link href="/resources" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">Resources</Link>
          <Link href="/stories" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">Success Stories</Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="bg-black text-white border-2 border-black px-8 py-3 shadow-brutalist-sm active:translate-y-1 active:shadow-none">
            JOIN PREP
          </Link>
        </div>
      )}
    </nav>
  );
}
