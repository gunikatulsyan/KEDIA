import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { services as mockServices } from '../mock';
import { getServices } from '../api';
import { getIcon } from '../iconMap';
import Reveal from './Reveal';

const Services = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getServices()
      .then((data) => setItems(data))
      .catch(() => setItems(mockServices.map((s, i) => ({ ...s, id: `mock-${i}`, icon: s.icon?.name }))));
  }, []);

  return (
    <section id="services" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-[12px] font-semibold tracking-[0.18em] brand-green">WHAT WE DO</span>
          <h2 className="mt-3 font-display font-bold text-[34px] sm:text-[42px] text-[#0f1f38]">Our Services</h2>
          <p className="mt-4 text-[16px] text-slate-500">Comprehensive financial, tax and business solutions for your organization.</p>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <Reveal key={s.id || i} delay={(i % 3) * 100}>
                <div className="group h-full rounded-2xl border border-slate-100 bg-white p-7 transition-all duration-300 hover:border-[#17b877]/40 hover:shadow-[0_18px_40px_-16px_rgba(15,31,56,0.18)] hover:-translate-y-1">
                  {s.image ? (
                    <div className="h-40 w-full rounded-xl overflow-hidden mb-5">
                      <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-[#17b877]/10 flex items-center justify-center transition-colors group-hover:bg-[#17b877]">
                      <Icon className="h-6 w-6 text-[#17b877] transition-colors group-hover:text-white" />
                    </div>
                  )}
                  <h3 className="mt-5 font-display font-semibold text-[19px] text-[#0f1f38]">{s.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-500">{s.desc}</p>
                  <a href="#contact" className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0f1f38] transition-colors group-hover:text-[#17b877]">
                    Learn More <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
