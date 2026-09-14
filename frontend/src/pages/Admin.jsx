import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Briefcase, Layers, LogOut, ExternalLink } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminInquiries from './AdminInquiries';
import AdminServices from './AdminServices';
import AdminExpertise from './AdminExpertise';

const tabs = [
  { key: 'inquiries', label: 'Inquiries', icon: Inbox },
  { key: 'services', label: 'Services', icon: Briefcase },
  { key: 'expertise', label: 'Expertise', icon: Layers },
];

const Admin = () => {
const [user, setUser] = useState(
  localStorage.getItem('kedia_admin_user') &&
  localStorage.getItem('kedia_admin_token')
);
  const [active, setActive] = useState('inquiries');

  if (!user) return <AdminLogin onSuccess={setUser} />;

  const logout = () => {
    localStorage.removeItem('kedia_admin_token');
    localStorage.removeItem('kedia_admin_user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <header className="bg-[#0a1830] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center">
              <span className="font-display font-bold text-[14px]"><span className="text-[#0b1c33]">C</span><span className="brand-green">A</span></span>
            </div>
            <span className="font-display font-bold text-[16px] text-white">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="hidden sm:inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/70 hover:text-white">
              View Site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-1.5 text-[13.5px] font-medium text-white/80 hover:bg-white/10 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {tabs.map((t) => {
            const Icon = t.icon;
            const on = active === t.key;
            return (
              <button key={t.key} onClick={() => setActive(t.key)}
                      className={`inline-flex items-center gap-2 px-4 py-3 text-[14.5px] font-semibold border-b-2 -mb-px transition-colors ${on ? 'border-[#17b877] text-[#17b877]' : 'border-transparent text-slate-500 hover:text-[#0f1f38]'}`}>
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {active === 'inquiries' && <AdminInquiries />}
        {active === 'services' && <AdminServices />}
        {active === 'expertise' && <AdminExpertise />}
      </div>
    </div>
  );
};

export default Admin;
