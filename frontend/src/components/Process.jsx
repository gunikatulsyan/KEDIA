import React from 'react';
import { processSteps } from '../mock';
import Reveal from './Reveal';

const Process = () => (
  <section className="bg-[#f6f7f9] py-24">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <Reveal className="text-center max-w-2xl mx-auto">
        <span className="text-[12px] font-semibold tracking-[0.18em] brand-green">HOW WE WORK</span>
        <h2 className="mt-3 font-display font-bold text-[34px] sm:text-[42px] text-[#0f1f38]">A Clear, Professional Process</h2>
        <p className="mt-4 text-[16px] text-slate-500">Four straightforward steps from first conversation to ongoing support.</p>
      </Reveal>

      <div className="mt-16 relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="hidden lg:block absolute top-6 left-[12%] right-[12%] h-px bg-slate-200" />
        {processSteps.map((p, i) => (
          <Reveal key={p.title} delay={i * 120}>
            <div className="relative text-center lg:text-left">
              <div className="relative z-10 mx-auto lg:mx-0 h-12 w-12 rounded-full border-2 border-[#17b877] bg-[#f6f7f9] flex items-center justify-center font-display font-bold text-[15px] text-[#0f1f38]">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-5 font-display font-semibold text-[20px] text-[#0f1f38]">{p.title}</h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-500">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Process;
