import {
  ClipboardCheck, ShieldCheck, FileCheck2, Calculator, FileText, Scale,
  BookOpen, Wallet, FileBarChart2, Building2, LineChart, Lightbulb, Briefcase
} from 'lucide-react';

export const iconMap = {
  ClipboardCheck, ShieldCheck, FileCheck2, Calculator, FileText, Scale,
  BookOpen, Wallet, FileBarChart2, Building2, LineChart, Lightbulb,
};

export const getIcon = (name) => iconMap[name] || Briefcase;

export const countryCodes = [
  { code: '+977', label: 'Nepal (+977)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA/Canada (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+86', label: 'China (+86)' },
  { code: '+49', label: 'Germany (+49)' },
];
