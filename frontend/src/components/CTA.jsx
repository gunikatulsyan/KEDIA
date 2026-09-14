import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA = () => (
  <section className="relative overflow-hidden bg-[#0a1830] py-24">
    <div className="absolute inset-0 grid-pattern" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(23,184,119,0.16),transparent_60%)]" />
    <div className="relative max-w-3xl mx-auto px-5 lg:px-8 text-center">
      <h2 className="font-display font-bold text-[36px] sm:text-[46px] leading-tight text-white">
        Let's Build Better Financial Decisions Together.
      </h2>
      <p className="mt-5 text-[17px] leading-relaxed text-white/60">
        Have a tax, audit, accounting or financial advisory requirement? Get in touch with Kedia and Associates.
      </p>
      <a href="#contact" className="mt-9 inline-flex items-center gap-2 rounded-lg bg-[#17b877] px-8 py-4 text-[15px] font-semibold text-white transition-all hover:bg-[#149c66] hover:-translate-y-0.5 shadow-lg shadow-[#17b877]/25">
        Get in Touch <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  </section>
);

export default CTA;
