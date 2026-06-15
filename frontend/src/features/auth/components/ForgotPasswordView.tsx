'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import NehnaXLogo from '@/components/layout/NehnaXLogo';

export default function ForgotPasswordView() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.forgotPassword(email.trim());
      setSent(true);
      toast(
        language === 'en' ? 'If that email exists, we sent a reset link.' : 'ኢመይል ኣሎ እንተኾነ ሊንክ ሰዲድና።',
        'success',
      );
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Request failed.';
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
        <h1 className="text-xl font-serif font-black text-black">
          {language === 'en' ? 'Reset password' : 'ሕላገት ቀይር'}
        </h1>
        <p className="text-black/55 text-xs mt-1">
          {language === 'en'
            ? 'Enter your email and we will send a password reset link.'
            : 'ኢመይልኩም ኣእትዉ ሊንክ ምቕያር ሕላገት ክንሰድድ እናቢ።'}
        </p>
      </div>

      {sent ? (
        <div className="p-6 space-y-4 text-sm text-center">
          <p className="text-black/70">
            {language === 'en'
              ? 'Check your email for a reset link. If you registered without email, sign in with your phone number or contact support.'
              : 'ኢመይልኩም ኣረጋግጹ።'}
          </p>
          <Link href="/login" className="text-sky-600 font-bold text-sm">
            {language === 'en' ? 'Back to sign in' : 'ናብ እተው'}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-black/70 text-xs font-medium mb-1">
              {language === 'en' ? 'Email address' : 'ኢመይል'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-black/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-60"
          >
            {submitting ? '...' : language === 'en' ? 'Send reset link' : 'ሊንክ ሰዲድ'}
          </button>
          <Link href="/login" className="block text-center text-[11px] text-sky-600 font-bold">
            {language === 'en' ? 'Back to sign in' : 'ናብ እተው'}
          </Link>
        </form>
      )}
    </div>
  );
}
