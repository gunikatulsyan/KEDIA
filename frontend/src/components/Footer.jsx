import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { navLinks, footerServices, contactInfo } from '../mock';

const Footer = () => (
  <footer className="bg-[#0a1830] pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
              <span className="font-display font-bold text-[15px]"><span className="text-[#0b1c33]">C</span><span className="brand-green">A</span></span>
            </div>
            <span className="font-display font-bold text-[18px] text-white">Kedia and Associates</span>
          </div>
          <p className="mt-5 text-[14.5px] leading-relaxed text-white/50 max-w-xs">
            A professional consultancy in Kathmandu, Nepal serving clients across audit, accounting, taxation, financial advisory and business consultancy.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={contactInfo.facebook} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-lg border border-white/12 flex items-center justify-center text-white/70 transition-colors hover:bg-[#17b877] hover:text-white hover:border-transparent">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-lg border border-white/12 flex items-center justify-center text-white/70 transition-colors hover:bg-[#17b877] hover:text-white hover:border-transparent">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[12px] font-semibold tracking-[0.16em] text-white/40">QUICK LINKS</h4>
          <ul className="mt-5 space-y-3">
            {navLinks.map((l) => (
              <li key={l.label}><a href={l.href} className="text-[14.5px] text-white/60 transition-colors hover:text-[#17b877]">{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[12px] font-semibold tracking-[0.16em] text-white/40">SERVICES</h4>
          <ul className="mt-5 space-y-3">
            {footerServices.map((s) => (
              <li key={s}><a href="#services" className="text-[14.5px] text-white/60 transition-colors hover:text-[#17b877]">{s}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[12px] font-semibold tracking-[0.16em] text-white/40">CONTACT</h4>
          <ul className="mt-5 space-y-4">
            <li className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-[#17b877] mt-0.5 shrink-0" />
              <div className="text-[14.5px] text-white/60 leading-relaxed">{contactInfo.phone}<br/>{contactInfo.office}</div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#17b877] mt-0.5 shrink-0" />
              <div className="text-[14.5px] text-white/60 leading-relaxed">{contactInfo.address}</div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-[#17b877] mt-0.5 shrink-0" />
              <div className="text-[14.5px] text-white/60 leading-relaxed">Office Hours: {contactInfo.hours}</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 pt-7 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[13px] text-white/40">© 2026 Kedia and Associates. All rights reserved.</p>
        <div className="flex items-center gap-7">
          <a href="#" className="text-[13px] text-white/40 hover:text-white/70">Privacy Policy</a>
          <a href="#" className="text-[13px] text-white/40 hover:text-white/70">Terms of Use</a>
          <Link to="/admin" className="text-[13px] text-white/40 hover:text-[#17b877]">Admin</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
