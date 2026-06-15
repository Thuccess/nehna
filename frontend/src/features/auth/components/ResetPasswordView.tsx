'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import NehnaXLogo from '@/components/layout/NehnaXLogo';

function ResetPasswordForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get('token') ?? '';

  const { language } = useLanguage();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast(language === 'en' ? 'Invalid reset link.' : 'ሊንክ ኣይሰማማዕን።', 'error');
      return;
    }
    if (password !== confirmPassword) {
      toast(language === 'en' ? 'Passwords do not match.' : 'ሕላገታት ኣይሰማማዕን።', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.resetPassword(token, password);
      toast(language === 'en' ? 'Password updated.' : 'ሕላገት ተቐይሩ።', 'success');
      router.push('/login');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Reset failed.';
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
          {language === 'en' ? 'Set new password' : 'ሕላገት ሓድስ'}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-black/70 text-xs font-medium mb-1">
            {language === 'en' ? 'New password' : 'ሕላገት ሓድስ'}
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-3.5 w-3.5 text-black/50" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-black/70 text-xs font-medium mb-1">
            {language === 'en' ? 'Confirm password' : 'ሕላገት ኣረጋግጽ'}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2.5 border border-black/10 rounded-xl bg-white text-base md:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !token}
          className="w-full py-3 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-extrabold text-sm min-h-[44px] disabled:opacity-60"
        >
          {submitting ? '...' : language === 'en' ? 'Update password' : 'ሕላገት ኣሐድስ'}
        </button>
        <Link href="/login" className="block text-center text-[11px] text-sky-600 font-bold">
          {language === 'en' ? 'Back to sign in' : 'ናብ እተው'}
        </Link>
      </form>
    </div>
  );
}

export default function ResetPasswordView() {
  return (
    <Suspense fallback={<div className="text-center text-black/60 text-sm py-12">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
