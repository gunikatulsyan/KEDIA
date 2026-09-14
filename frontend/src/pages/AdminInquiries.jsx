import React, { useEffect, useState } from 'react';
import { Trash2, Mail, Phone, Building2, Inbox, RefreshCw } from 'lucide-react';
import { listInquiries, deleteInquiry } from '../api';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const AdminInquiries = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listInquiries());
    } catch (e) {
      toast({ title: 'Failed to load inquiries' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    await deleteInquiry(id);
    setItems((p) => p.filter((i) => i.id !== id));
    toast({ title: 'Inquiry deleted' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-[22px] text-[#0f1f38]">Inquiries</h2>
          <p className="text-[14px] text-slate-500">{items.length} total submissions</p>
        </div>
        <Button variant="outline" onClick={load} className="gap-2"><RefreshCw className="h-4 w-4" /> Refresh</Button>
      </div>

      {loading ? (
        <div className="text-slate-400 py-10 text-center">Loading...</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <Inbox className="h-10 w-10 mb-3" />
          <p>No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display font-semibold text-[16px] text-[#0f1f38]">{it.name}</span>
                    {it.service && <span className="rounded-full bg-[#17b877]/10 text-[#17b877] text-[12px] font-medium px-3 py-0.5">{it.service}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[13.5px] text-slate-500">
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {it.email}</span>
                    {it.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {it.country_code} {it.phone}</span>}
                    {it.company && <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {it.company}</span>}
                  </div>
                  <p className="mt-3 text-[14.5px] text-slate-600 leading-relaxed">{it.message}</p>
                  <p className="mt-2 text-[12px] text-slate-400">{new Date(it.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => remove(it.id)} className="shrink-0 h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
