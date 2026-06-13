'use client';

import { ShoppingBag, Store } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import NehnaXLogo from '@/components/layout/NehnaXLogo';
import { ButtonLink } from '@/components/ui/Button';

export default function RegisterChoiceView() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-md mx-auto bg-slate-50 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-white p-6 border-b border-black/10 text-center space-y-3">
        <div className="flex justify-center mb-2">
          <NehnaXLogo linkToHome className="max-w-[200px]" />
        </div>
        <h1 className="text-xl font-serif font-black text-black">
          {language === 'en' ? 'Create your account' : 'ኣካውንት ፍጠር'}
        </h1>
        <p className="text-black/60 text-xs">
          {language === 'en'
            ? 'Admin approval required before sign-in.'
            : 'ቅድሚ እተው ምጽዳቕ ኣድማሪ ይድለዩ።'}
        </p>
      </div>
      <div className="p-6 space-y-3">
        <ButtonLink href="/register/buyer" variant="primary" size="lg" icon={ShoppingBag} className="w-full">
          {language === 'en' ? 'Buyer' : 'ዓሚል'}
        </ButtonLink>
        <ButtonLink href="/register/seller" variant="outline" size="lg" icon={Store} className="w-full">
          {language === 'en' ? 'Seller' : 'ሸያጢ'}
        </ButtonLink>
        <p className="text-center text-[11px] text-black/60 pt-2">
          {language === 'en' ? 'Have an account?' : 'ኣካውንት ኣሎ?'}{' '}
          <ButtonLink href="/login" variant="ghost" size="sm" className="text-sky-600 hover:text-sky-700">
            {t.loginBtn}
          </ButtonLink>
        </p>
      </div>
    </div>
  );
}
