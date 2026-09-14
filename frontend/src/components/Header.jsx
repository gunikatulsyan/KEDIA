import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { navLinks } from '../mock';

const Logo = ({ dark = false }) => (
  <a href="#home" className="flex items-center gap-3 group">
    <div className="h-10 w-10 rounded-lg bg-[#0b1c33] flex items-center justify-center shrink-0">
      <span className="font-display font-bold text-[15px] tracking-tight">
        <span className="text-white">C</span><span className="brand-green">A</span>
      </span>
    </div>
    <div className="leading-tight">
      <div className={`font-display font-bold text-[17px] ${dark ? 'text-white' : 'text-[#0f1f38]'}`}>Kedia and Associates</div>
      <div className={`text-[10px] font-semibold tracking-[0.18em] ${dark ? 'text-white/50' : 'text-slate-400'}`}>AUDIT · TAX · ADVISORY</div>
    </div>
  </a>
);

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(15,31,56,0.06)]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="h-[72px] flex items-center justify-between">
          <Logo dark={!scrolled} />

          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href}
                 className={`text-[15px] font-medium transition-colors hover:text-[#17b877] ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>
                {l.label}
              </a>
            ))}
          </nav>

          <a href="#contact"
             className="hidden lg:inline-flex items-center gap-2 rounded-lg bg-[#0b1c33] px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[#132844] hover:-translate-y-0.5">
            Get Consultation <ArrowRight className="h-4 w-4" />
          </a>

          <button onClick={() => setOpen(!open)}
                  className={`lg:hidden p-2 rounded-md ${scrolled ? 'text-[#0f1f38]' : 'text-white'}`}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-5 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                 className="py-2.5 text-[15px] font-medium text-slate-700 hover:text-[#17b877]">
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)}
               className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b1c33] px-5 py-3 text-[14px] font-semibold text-white">
              Get Consultation <ArrowRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
