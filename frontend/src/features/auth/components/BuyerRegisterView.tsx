'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Clock, PlusCircle } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import NehnaXLogo from '@/components/layout/NehnaXLogo';

export default function BuyerRegisterView() {
  const { register } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast(language === 'en' ? 'Passwords do not match.' : 'ሕላገታት ኣይሰማማዕን።', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name,
        phone,
        email: email.trim() || undefined,
        password,
        role: 'customer',
      });
      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed.';
      toast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-slate-50 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-white p-8 text-center space-y-4 border-b border-black/10">
          <Clock className="h-12 w-12 text-flag-gold-600 mx-auto" />
          <h1 className="text-xl font-serif font-black text-black">
            {language === 'en' ? 'Application submitted' : 'መዝገብ ቀሪቡ'}
          </h1>
          <p className="text-black/60 text-sm leading-relaxed">
            {language === 'en'
              ? 'Your buyer account is pending admin approval. You can browse as a guest now. Sign in after approval to save favorites and submit orders.'
              : 'ኣካውንትኩም ንምጽዳቕ ቀሪቡ። ከም ዓላይ ድለ። ኣብ ድሕሪ ምጽዳቕ እተው።'}
          </p>
        </div>
        <div className="p-6 space-y-3">
          <Link
            href="/"
            className="block w-full py-3 text-center bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-extrabold text-sm"
          >
            {language === 'en' ? 'Browse marketplace' : 'ኣብ ዕዳጋ ድለ'}
          </Link>
          <Link
            href="/login/buyer"
            className="block w-full py-3 text-center border border-black/15 rounded-xl font-bold text-sm text-black/80"
          >
            {language === 'en' ? 'Buyer sign in' : 'እተው ዓሚል'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-slate-50 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-white p-6 border-b border-black/10">
        <div className="flex justify-center mb-4">
          <NehnaXLogo linkToHome size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-500 border border-sky-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase mb-2">
          <PlusCircle className="h-3 w-3" />
          <span>{language === 'en' ? 'Buyer account' : 'ኣካውንት ዓሚል'}</span>
        </div>
        <h1 className="text-xl font-serif font-black text-black">
          {language === 'en' ? 'Create buyer account' : 'ኣካውንት ዓሚል ፍጠር'}
        </h1>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-4 text-sm">
        <div>
          <label className="block text-black/70 text-xs font-medium mb-1">{t.fullName} *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
          />
        </div>
        <div>
          <label className="block text-black/70 text-xs font-medium mb-1">{t.phone} *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono text-base md:text-sm"
          />
        </div>
        <div>
          <label className="block text-black/70 text-xs font-medium mb-1">
            {language === 'en' ? 'Email (optional)' : 'ኢመይል (ኣማራጺ)'}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
          />
        </div>
        <div>
          <label className="block text-black/70 text-xs font-medium mb-1">
            {language === 'en' ? 'Password' : 'ሕላገት'} *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono text-base md:text-sm"
          />
        </div>
        <div>
          <label className="block text-black/70 text-xs font-medium mb-1">
            {language === 'en' ? 'Confirm password' : 'ሕላገት ኣረጋግጽ'} *
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white font-mono text-base md:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-60"
        >
          {submitting ? '...' : language === 'en' ? 'Submit application' : 'መዝገብ ኣቕርብ'}
        </button>
        <p className="text-center text-[11px] text-black/60">
          <Link href="/register" className="text-sky-600 font-bold">
            {language === 'en' ? 'Back' : 'ተመለስ'}
          </Link>
        </p>
      </form>
    </div>
  );
}
