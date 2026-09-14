import React, { useEffect, useState } from 'react';
import { expertise as mockExpertise } from '../mock';
import { getExpertise } from '../api';
import Reveal from './Reveal';

const Expertise = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getExpertise()
      .then((data) => setItems(data))
      .catch(() => setItems(mockExpertise.map((t, i) => ({ id: `mock-${i}`, title: t }))));
  }, []);

  return (
    <section id="expertise" className="bg-[#f6f7f9] py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-[12px] font-semibold tracking-[0.18em] brand-green">DEPTH ACROSS DISCIPLINES</span>
          <h2 className="mt-3 font-display font-bold text-[34px] sm:text-[42px] text-[#0f1f38]">Our Areas of Expertise</h2>
          <p className="mt-4 text-[16px] text-slate-500">Connected disciplines spanning assurance, taxation, finance and business advisory.</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {items.map((item, i) => (
            <Reveal key={item.id || i} delay={(i % 5) * 80}>
              <div className="group h-full rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:border-[#17b877] hover:-translate-y-1 hover:shadow-[0_16px_36px_-18px_rgba(15,31,56,0.2)]">
                {item.image ? (
                  <div className="relative h-28 w-full overflow-hidden">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-2 left-3 font-display font-bold text-[14px] tracking-[0.1em] text-white drop-shadow">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                ) : null}
                <div className="p-6">
                  {!item.image && (
                    <div className="font-display font-bold text-[15px] tracking-[0.1em] brand-green">{String(i + 1).padStart(2, '0')}</div>
                  )}
                  <div className={`font-display font-semibold text-[17px] text-[#0f1f38] ${item.image ? '' : 'mt-4'}`}>{item.title}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
