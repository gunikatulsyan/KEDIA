import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';
import { adminLogin } from '../api';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const AdminLogin = ({ onSuccess }) => {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminLogin(username, password);
      localStorage.setItem('kedia_admin_token', data.token);
      localStorage.setItem('kedia_admin_user', data.username);
      onSuccess(data.username);
    } catch (err) {
      toast({ title: 'Login failed', description: 'Invalid username or password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1830] relative overflow-hidden px-5">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-0 right-0 h-[500px] w-[600px] bg-[radial-gradient(circle_at_top_right,rgba(23,184,119,0.2),transparent_60%)]" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-lg bg-[#0b1c33] flex items-center justify-center">
            <span className="font-display font-bold text-[16px]"><span className="text-white">C</span><span className="brand-green">A</span></span>
          </div>
          <div>
            <div className="font-display font-bold text-[17px] text-[#0f1f38]">Admin Panel</div>
            <div className="text-[12px] text-slate-400">Kedia and Associates</div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <Label className="text-[14px] font-medium text-slate-700">Username</Label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="pl-9" />
            </div>
          </div>
          <div>
            <Label className="text-[14px] font-medium text-slate-700">Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#17b877] hover:bg-[#149c66] text-white font-semibold py-6">
            {loading ? 'Signing in...' : (<>Sign In <ArrowRight className="h-4 w-4 ml-2" /></>)}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
