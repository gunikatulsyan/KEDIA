import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../api';
import { getIcon } from '../iconMap';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../components/ui/dialog';
import ImageUpload from '../components/ImageUpload';
import { useToast } from '../hooks/use-toast';

const blank = { title: '', desc: '', image: '' };

const AdminServices = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);

  const load = async () => { try { setItems(await getServices()); } catch { /* noop */ } };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ title: s.title, desc: s.desc || '', image: s.image || '' }); setOpen(true); };

  const save = async () => {
    if (!form.title.trim()) { toast({ title: 'Title is required' }); return; }
    try {
      if (editing) {
        const payload = { ...editing, ...form };
        const updated = await updateService(editing.id, payload);
        setItems((p) => p.map((i) => (i.id === editing.id ? updated : i)));
        toast({ title: 'Service updated' });
      } else {
        const created = await createService({ ...form, order: items.length });
        setItems((p) => [...p, created]);
        toast({ title: 'Service added' });
      }
      setOpen(false);
    } catch { toast({ title: 'Save failed' }); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await deleteService(id);
    setItems((p) => p.filter((i) => i.id !== id));
    toast({ title: 'Service deleted' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-[22px] text-[#0f1f38]">Services</h2>
          <p className="text-[14px] text-slate-500">{items.length} services shown on the website</p>
        </div>
        <Button onClick={openNew} className="gap-2 bg-[#17b877] hover:bg-[#149c66] text-white"><Plus className="h-4 w-4" /> Add Service</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((s) => {
          const Icon = getIcon(s.icon);
          return (
            <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-5">
              {s.image ? (
                <div className="h-28 w-full rounded-lg overflow-hidden mb-4"><img src={s.image} alt={s.title} className="h-full w-full object-cover" /></div>
              ) : (
                <div className="h-11 w-11 rounded-lg bg-[#17b877]/10 flex items-center justify-center mb-4"><Icon className="h-5 w-5 text-[#17b877]" /></div>
              )}
              <h3 className="font-display font-semibold text-[16px] text-[#0f1f38]">{s.title}</h3>
              <p className="mt-1.5 text-[13px] text-slate-500 line-clamp-2">{s.desc}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(s)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[13px] font-medium text-slate-600 hover:border-[#17b877] hover:text-[#17b877] transition-colors"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                <button onClick={() => remove(s.id)} className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[14px]">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2" placeholder="Service title" />
            </div>
            <div>
              <Label className="text-[14px]">Description</Label>
              <Textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} className="mt-2 resize-none" placeholder="Short description" />
            </div>
            <div>
              <Label className="text-[14px]">Picture</Label>
              <div className="mt-2"><ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-[#17b877] hover:bg-[#149c66] text-white">{editing ? 'Save Changes' : 'Add Service'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
