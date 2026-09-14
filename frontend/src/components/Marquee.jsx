import React from 'react';
import { marqueeItems } from '../mock';

const Marquee = () => {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="bg-[#0a1830] border-y border-white/[0.06] py-4 overflow-hidden">
      <div className="marquee-mask">
        <div className="flex w-max animate-marquee">
          {items.map((item, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="px-8 text-[13px] font-semibold tracking-[0.14em] text-white/45 uppercase">{item}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#17b877]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
