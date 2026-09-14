import React from 'react';
import { whyUs } from '../mock';
import Reveal from './Reveal';

const WhyUs = () => (
  <section className="bg-white py-24">
    <div className="max-w-5xl mx-auto px-5 lg:px-8">
      <Reveal className="text-center max-w-2xl mx-auto">
        <span className="text-[12px] font-semibold tracking-[0.18em] brand-green">THE DIFFERENCE</span>
        <h2 className="mt-3 font-display font-bold text-[34px] sm:text-[42px] text-[#0f1f38]">Why Kedia and Associates?</h2>
        <p className="mt-4 text-[16px] text-slate-500">A professional consultancy built on experience, accuracy and practical guidance.</p>
      </Reveal>

      <div className="mt-14 border-t border-slate-200">
        {whyUs.map((w, i) => (
          <Reveal key={w.title} delay={i * 60}>
            <div className="group grid md:grid-cols-[80px_1fr_1.2fr] gap-4 md:gap-8 items-center py-7 border-b border-slate-200 transition-colors hover:bg-[#f6f7f9] px-4 -mx-4 rounded-lg">
              <div className="font-display font-bold text-[34px] text-slate-200 transition-colors group-hover:text-[#17b877]">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="font-display font-semibold text-[20px] text-[#0f1f38]">{w.title}</h3>
              <p className="text-[15px] leading-relaxed text-slate-500">{w.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUs;
