import React, { useState } from 'react';
import { Phone, MapPin, Clock, PhoneCall, ExternalLink, Facebook, Instagram, Send } from 'lucide-react';
import { contactInfo, serviceOptions } from '../mock';
import { countryCodes } from '../iconMap';
import { submitInquiry } from '../api';
import Reveal from './Reveal';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './ui/select';
import { useToast } from '../hooks/use-toast';

const infoRows = [
  { icon: Phone, label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone}` },
  { icon: Phone, label: 'Office', value: contactInfo.office, href: `tel:${contactInfo.office}` },
  { icon: PhoneCall, label: 'Additional Contact', value: contactInfo.additional, href: `tel:${contactInfo.additional}` },
  { icon: MapPin, label: 'Address', value: contactInfo.address },
  { icon: Clock, label: 'Office Hours', value: contactInfo.hours },
];

const empty = { name: '', email: '', country_code: '+977', phone: '', company: '', service: '', message: '' };

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill required fields', description: 'Name, email and message are required.' });
      return;
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      toast({ title: 'Invalid phone number', description: 'Phone number must be exactly 10 digits.' });
      return;
    }
    setSubmitting(true);
    try {
      await submitInquiry(form);
      toast({ title: 'Inquiry submitted', description: 'Thank you! We respond to every inquiry.' });
      setForm(empty);
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Something went wrong. Please try again.';
      toast({ title: 'Submission failed', description: String(msg) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-[12px] font-semibold tracking-[0.18em] brand-green">CONTACT US</span>
          <h2 className="mt-3 font-display font-bold text-[34px] sm:text-[42px] text-[#0f1f38]">Get in Touch</h2>
          <p className="mt-4 text-[16px] text-slate-500">Reach out for audit, tax, accounting or advisory requirements — we respond to every inquiry.</p>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-2 gap-10">
          <Reveal>
            <div className="space-y-6">
              {infoRows.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.label} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17b877]/10 shrink-0">
                      <Icon className="h-5 w-5 text-[#17b877]" />
                    </span>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-400">{r.label}</div>
                      {r.href ? (
                        <a href={r.href} className="text-[16px] font-medium text-[#0f1f38] hover:text-[#17b877]">{r.value}</a>
                      ) : (
                        <div className="text-[16px] font-medium text-[#0f1f38]">{r.value}</div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a href={`tel:${contactInfo.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-[#17b877] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#149c66]">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-[14px] font-semibold text-[#0f1f38] transition-colors hover:border-[#17b877]">
                  Send Inquiry
                </a>
              </div>

              <div className="pt-2">
                <div className="text-[13px] font-semibold text-slate-400 mb-3">Follow us</div>
                <div className="flex gap-3">
                  <a href={contactInfo.facebook} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 transition-colors hover:bg-[#17b877] hover:text-white hover:border-transparent"><Facebook className="h-4.5 w-4.5" /></a>
                  <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 transition-colors hover:bg-[#17b877] hover:text-white hover:border-transparent"><Instagram className="h-4.5 w-4.5" /></a>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-[240px]">
                <a href="https://maps.google.com/?q=Kalanki,Kathmandu,Nepal" target="_blank" rel="noreferrer"
                   className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[13px] font-semibold text-[#17b877] shadow-md">
                  Open in Maps <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <iframe
                  title="Kedia and Associates location"
                  src="https://www.google.com/maps?q=Kalanki,Kathmandu,Nepal&output=embed"
                  className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={submit} className="rounded-2xl border border-slate-100 bg-[#f6f7f9] p-7 sm:p-9 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-[14px] font-medium text-slate-700">Full Name *</Label>
                  <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" className="mt-2 bg-white" />
                </div>
                <div>
                  <Label className="text-[14px] font-medium text-slate-700">Email Address *</Label>
                  <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" className="mt-2 bg-white" />
                </div>
              </div>

              <div className="mt-5">
                <Label className="text-[14px] font-medium text-slate-700">Phone Number</Label>
                <div className="mt-2 flex gap-3">
                  <div className="w-[140px] shrink-0">
                    <Select value={form.country_code} onValueChange={(v) => update('country_code', v)}>
                      <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((c) => (<SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10 digit number"
                    inputMode="numeric"
                    className="bg-white"
                  />
                </div>
                {form.phone && form.phone.length !== 10 && (
                  <p className="mt-1.5 text-[12.5px] text-red-500">Phone must be exactly 10 digits.</p>
                )}
              </div>

              <div className="mt-5">
                <Label className="text-[14px] font-medium text-slate-700">Company / Organization</Label>
                <Input value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Company name" className="mt-2 bg-white" />
              </div>

              <div className="mt-5">
                <Label className="text-[14px] font-medium text-slate-700">Service Required</Label>
                <Select value={form.service} onValueChange={(v) => update('service', v)}>
                  <SelectTrigger className="mt-2 bg-white"><SelectValue placeholder="Select a service" /></SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-5">
                <Label className="text-[14px] font-medium text-slate-700">Message *</Label>
                <Textarea value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Tell us about your requirement..." rows={5} className="mt-2 bg-white resize-none" />
              </div>

              <Button type="submit" disabled={submitting} className="mt-6 w-full bg-[#17b877] hover:bg-[#149c66] text-white text-[15px] font-semibold py-6">
                <Send className="h-4 w-4 mr-2" /> {submitting ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
