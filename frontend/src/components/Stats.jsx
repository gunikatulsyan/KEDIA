import React from 'react';
import { heroStats } from '../mock';

const Stats = () => (
  <div className="bg-white border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-slate-100">
        {heroStats.map((s, i) => (
          <div key={i} className="px-6 py-8 text-center">
            <div className={`font-display font-bold text-[26px] ${s.highlight ? 'brand-green' : 'text-[#0f1f38]'}`}>{s.top}</div>
            <div className="mt-1 text-[14px] text-slate-500">{s.bottom}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Stats;
