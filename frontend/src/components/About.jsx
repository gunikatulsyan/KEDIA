import React from 'react';
import { Check } from 'lucide-react';
import { aboutChecklist, aboutTags } from '../mock';
import Reveal from './Reveal';

const About = () => (
  <section id="about" className="relative bg-[#f6f7f9] py-24">
    <div className="absolute inset-0 grid-pattern-light opacity-60" />
    <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <span className="text-[12px] font-semibold tracking-[0.18em] brand-green">ABOUT KEDIA AND ASSOCIATES</span>
          <h2 className="mt-4 font-display font-bold text-[34px] sm:text-[40px] leading-[1.15] text-[#0f1f38]">
            Built on Accuracy. <span className="brand-green">Driven by Insight.</span>
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-500 max-w-xl">
            Kedia and Associates is a professional consultancy serving clients across audit, accounting, taxation, financial advisory and business consultancy. With 7 years of experience, the firm helps businesses navigate financial responsibilities, regulatory requirements and strategic financial decisions with clarity and confidence.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {aboutChecklist.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17b877]/12">
                  <Check className="h-3.5 w-3.5 text-[#17b877]" />
                </span>
                <span className="text-[15px] text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative">
            <div className="relative rounded-2xl bg-gradient-to-br from-[#0b1c33] to-[#0f2a24] p-8 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-70" />
              <div className="relative">
                <div className="h-16 w-16 rounded-xl bg-white flex items-center justify-center mb-7">
                  <span className="font-display font-bold text-[22px]"><span className="text-[#0b1c33]">C</span><span className="brand-green">A</span></span>
                </div>
                <h3 className="font-display font-bold text-[26px] leading-tight text-white">Clarity in numbers.<br/>Confidence in decisions.</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/55">
                  A single professional consultancy for audit, accounts, tax and advisory — serving organizations across Nepal from Kathmandu.
                </p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {aboutTags.map((t) => (
                    <span key={t} className="rounded-lg border border-white/12 bg-white/[0.06] px-4 py-1.5 text-[13px] font-medium text-white">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-4 sm:right-8 rounded-xl bg-white px-6 py-4 shadow-xl border border-slate-100">
              <div className="font-display font-bold text-[26px] text-[#0f1f38]">7+</div>
              <div className="text-[13px] text-slate-500">Years of Experience</div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default About;
