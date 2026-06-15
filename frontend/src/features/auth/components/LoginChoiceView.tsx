'use client';

import { LogIn, ShoppingBag, Store } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import NehnaXLogo from '@/components/layout/NehnaXLogo';
import { ButtonLink } from '@/components/ui/Button';

export default function LoginChoiceView() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-md mx-auto bg-slate-50 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-white p-6 border-b border-black/10 text-center space-y-3">
        <div className="flex justify-center mb-2">
          <NehnaXLogo linkToHome size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-500 border border-sky-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase">
          <LogIn className="app-icon app-icon-sm" strokeWidth={2.25} />
          <span>{t.loginBtn}</span>
        </div>
        <h1 className="text-xl font-serif font-black text-black">
          {language === 'en' ? 'Sign in to Nehna' : 'ናብ Nehna እተው'}
        </h1>
      </div>
      <div className="p-6 space-y-3">
        <ButtonLink href="/login/buyer" variant="primary" size="lg" icon={ShoppingBag} className="w-full">
          {language === 'en' ? 'Buyer' : 'ዓሚል'}
        </ButtonLink>
        <ButtonLink href="/login/seller" variant="outline" size="lg" icon={Store} className="w-full">
          {language === 'en' ? 'Seller' : 'ሸያጢ'}
        </ButtonLink>
        <p className="text-center text-[11px] text-black/60 pt-2">
          <ButtonLink href="/register" variant="ghost" size="sm" className="text-sky-600 hover:text-sky-700">
            {t.registerBtn}
          </ButtonLink>
        </p>
      </div>
    </div>
  );
}
