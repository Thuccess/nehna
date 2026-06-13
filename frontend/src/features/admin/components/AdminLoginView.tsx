'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { KeyRound, LogIn, Mail, Shield } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import NehnaXLogo from '@/components/layout/NehnaXLogo';
import { Button } from '@/components/ui/Button';

export default function AdminLoginView() {
  const router = useRouter();
  const { login, logout } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email.trim(), password, 'admin');
      toast(
        language === 'en' ? `Welcome, ${user.name}` : `እንቋዕ ብደሓን መጻእካ ${user.name}`,
        'success',
      );
      router.replace('/admin');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        await logout();
      }
      const msg =
        err instanceof ApiError
          ? err.message
          : language === 'en'
            ? 'Sign in failed.'
            : 'ኣይተኣተወን።';
      toast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-white p-6 border-b border-black/10">
        <div className="flex justify-center mb-4">
          <NehnaXLogo linkToHome className="max-w-[200px]" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-nehnax-navy-500/10 text-nehnax-navy-600 border border-nehnax-navy-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase mb-2">
          <Shield className="h-3 w-3" />
          <span>{language === 'en' ? 'Administrator' : 'ምሕደራ'}</span>
        </div>
        <h1 className="text-xl font-serif font-black text-black tracking-tight">
          {language === 'en' ? 'Admin sign in' : 'እተው ምሕደራ'}
        </h1>
        <p className="text-black/55 text-xs mt-1">
          {language === 'en'
            ? 'Authorized platform operators only.'
            : 'ናይ ፕላትፎርም ኣፈላልያት ጥራይ።'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4 text-xs font-sans">
        <div>
          <label className="block text-black/70 font-mono uppercase tracking-wider text-[10px] mb-1.5">
            {language === 'en' ? 'Email' : 'ኢመይል'}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-black/50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-black/10 rounded-xl focus:border-sky-500 focus:outline-none text-black text-base md:text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-black/70 font-mono uppercase tracking-wider text-[10px] mb-1.5">
            {language === 'en' ? 'Password' : 'ሕላገት'}
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-3.5 w-3.5 text-black/50" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-black/10 rounded-xl focus:border-sky-500 focus:outline-none text-black font-mono text-base md:text-xs"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          variant="primary"
          size="lg"
          icon={LogIn}
          className="w-full"
        >
          {submitting ? '...' : language === 'en' ? 'Sign in' : 'እተው'}
        </Button>
      </form>
    </div>
  );
}
