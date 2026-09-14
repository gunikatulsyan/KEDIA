import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const ChartCard = () => (
  <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 shadow-2xl">
    <div className="flex items-center justify-between mb-6">
      <span className="text-[11px] font-semibold tracking-[0.16em] text-white/40">ADVISORY COVERAGE</span>
      <div className="flex items-center gap-4 text-[11px]">
        <span className="flex items-center gap-1.5 text-white/60"><span className="h-2 w-2 rounded-full bg-[#17b877]" />Assurance</span>
        <span className="flex items-center gap-1.5 text-white/60"><span className="h-2 w-2 rounded-full bg-[#4f8cff]" />Advisory</span>
      </div>
    </div>

    <div className="relative h-[240px]">
      <span className="absolute left-2 top-2 z-10 rounded-full bg-[#0f2b1f] border border-[#17b877]/30 px-3 py-1 text-[11px] font-medium text-white"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[#17b877] mr-1.5 align-middle" />Audit &amp; Assurance</span>
      <span className="absolute right-6 top-16 z-10 rounded-full bg-[#12233d] border border-white/10 px-3 py-1 text-[11px] font-medium text-white"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[#17b877] mr-1.5 align-middle" />Tax Advisory</span>
      <span className="absolute left-2 bottom-6 z-10 rounded-full bg-[#12233d] border border-white/10 px-3 py-1 text-[11px] font-medium text-white"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4f8cff] mr-1.5 align-middle" />Business Consultancy</span>

      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#17b877" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#17b877" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,170 C60,150 90,120 140,110 C190,100 210,70 260,55 C310,42 350,35 400,28 L400,220 L0,220 Z" fill="url(#greenFill)" />
        <path d="M0,170 C60,150 90,120 140,110 C190,100 210,70 260,55 C310,42 350,35 400,28"
              fill="none" stroke="#17b877" strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray="600" strokeDashoffset="600" style={{ animation: 'drawLine 2s ease forwards' }} />
        <path d="M0,195 C70,185 110,170 160,160 C220,148 260,140 310,128 C350,120 380,115 400,110"
              fill="none" stroke="#4f8cff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"
              strokeDasharray="600" strokeDashoffset="600" style={{ animation: 'drawLine 2.4s ease forwards' }} />
        <circle cx="140" cy="110" r="4" fill="#17b877" />
        <circle cx="260" cy="55" r="4" fill="#17b877" />
      </svg>
    </div>

    <div className="flex items-center justify-between mt-2 text-[11px] text-white/30 px-1">
      <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
    </div>
  </div>
);

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-[#0a1830] pt-[72px]">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-0 right-0 h-[600px] w-[700px] bg-[radial-gradient(circle_at_top_right,rgba(23,184,119,0.22),transparent_60%)]" />
      <div className="absolute -bottom-20 left-1/4 h-[400px] w-[500px] bg-[radial-gradient(circle,rgba(23,184,119,0.10),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[#17b877]" />
              <span className="text-[12px] font-semibold tracking-[0.18em] text-[#17b877]">KEDIA AND ASSOCIATES · KATHMANDU</span>
            </div>

            <h1 className="font-display font-bold text-white text-[42px] leading-[1.08] sm:text-[54px] lg:text-[58px]">
              Professional Financial <span className="brand-green">&amp;</span> Business Advisory Services
            </h1>

            <p className="mt-6 text-[17px] leading-relaxed text-white/60 max-w-xl">
              Kedia and Associates provides audit, taxation, accounting, financial advisory and business consultancy services designed to help organizations operate with confidence and make informed financial decisions.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-lg bg-[#17b877] px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#149c66] hover:-translate-y-0.5 shadow-lg shadow-[#17b877]/20">
                Book a Consultation <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#services" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-white/10">
                Explore Our Services
              </a>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-[#17b877]" />
              <span className="text-[13px] font-medium text-white/70">7+ Years of Professional Experience</span>
            </div>
          </div>

          <div className="lg:pl-6">
            <ChartCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
