'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { LogIn, Phone, KeyRound } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import NehnaXLogo from '@/components/layout/NehnaXLogo';
import { Button } from '@/components/ui/Button';

type LoginIntent = 'buyer' | 'seller';

function LoginForm({ intent }: { intent: LoginIntent }) {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next');

  const { login, logout } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const title =
    intent === 'buyer'
      ? language === 'en'
        ? 'Buyer sign in'
        : 'እተው ዓሚል'
      : language === 'en'
        ? 'Seller sign in'
        : 'እተው ሸያጢ';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(identifier.trim(), password, intent);
      toast(`${language === 'en' ? 'Welcome back,' : 'እንቋዕ ብደሓን መጻእካ፣'} ${user.name}!`, 'success');

      if (next && next.startsWith('/') && !next.startsWith('//')) {
        router.push(next);
        return;
      }
      if (user.role === 'admin') router.push('/admin');
      else if (intent === 'seller' || user.role === 'seller') router.push('/seller');
      else router.push('/');
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        await logout();
      }
      const msg =
        err instanceof ApiError ? err.message : language === 'en' ? 'Login failed.' : 'ኣይተኣተወን።';
      toast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-white p-6 border-b border-black/10">
        <div className="flex justify-center mb-4">
          <NehnaXLogo linkToHome size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-500 border border-sky-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase mb-2">
          <LogIn className="h-3 w-3" />
          <span>{t.loginBtn}</span>
        </div>
        <h1 className="text-xl font-serif font-black text-black tracking-tight">{title}</h1>
        <p className="text-black/55 text-xs mt-1">
          {language === 'en'
            ? 'Use your email or phone and password. Active accounts only.'
            : 'ኢመይል ወይ ስልኪን ሕላገትን ተጠቐሙ።'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4 text-xs font-sans">
        <div>
          <label className="block text-black/70 font-mono uppercase tracking-wider text-[10px] mb-1.5">
            {language === 'en' ? 'Email or phone' : 'ኢመይል ወይ ስልኪ'}
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-black/50" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
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
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-black/10 rounded-xl focus:border-sky-500 focus:outline-none text-black font-mono text-base md:text-xs"
            />
          </div>
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className="text-[11px] text-sky-600 font-bold hover:underline">
            {language === 'en' ? 'Forgot password?' : 'ሕላገት ረሲዕካዮ?'}
          </Link>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          variant="primary"
          size="lg"
          icon={LogIn}
          className="w-full"
        >
          {submitting ? '...' : t.loginBtn}
        </Button>

        <div className="text-center text-black/60 text-[11px] pt-2 border-t border-black/5 space-y-1">
          <p>
            {intent === 'buyer' ? (
              <Link href="/login/seller" className="text-sky-500 font-bold">
                {language === 'en' ? 'Seller sign in' : 'እተው ሸያጢ'}
              </Link>
            ) : (
              <Link href="/login/buyer" className="text-sky-500 font-bold">
                {language === 'en' ? 'Buyer sign in' : 'እተው ዓሚል'}
              </Link>
            )}
          </p>
          <p>
            {language === 'en' ? 'New to Nehna?' : 'ሓድሽ?'}{' '}
            <Link href="/register" className="text-sky-500 font-bold">{t.registerBtn}</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export function BuyerLoginView() {
  return (
    <Suspense fallback={<div className="text-center text-black/60 text-sm py-12">Loading...</div>}>
      <LoginForm intent="buyer" />
    </Suspense>
  );
}

export function SellerLoginView() {
  return (
    <Suspense fallback={<div className="text-center text-black/60 text-sm py-12">Loading...</div>}>
      <LoginForm intent="seller" />
    </Suspense>
  );
}
