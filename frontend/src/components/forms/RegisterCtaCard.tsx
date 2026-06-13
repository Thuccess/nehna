'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { ButtonLink } from '@/components/ui/Button';
import { Store } from 'lucide-react';

export default function RegisterCtaCard() {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const href = user ? '/seller' : '/register/seller';

  return (
    <div className="bg-slate-50 text-black p-5 rounded-2xl border border-black/10 space-y-3.5 shadow-xl">
      <span className="bg-sky-500/10 text-sky-500 border border-sky-500/20 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded font-mono">
        {language === 'en' ? 'Sell' : 'ሸያጥ'}
      </span>
      <h4 className="text-xs font-bold font-display text-black uppercase tracking-wide">
        {language === 'en' ? 'List your shop' : 'ድኳንኩም ኣቕርቡ'}
      </h4>
      <p className="text-black/70 text-[11px] leading-relaxed font-sans">
        {language === 'en'
          ? 'Food, fashion, beauty, rentals — quick mobile onboarding.'
          : 'ኣብ 1 ደቒቕ ድኳንኩም ኣቕርቡ።'}
      </p>
      <ButtonLink href={href} variant="primary" size="md" icon={Store} className="w-full">
        {user ? t.addBusinessBtn : t.joinAsSeller}
      </ButtonLink>
    </div>
  );
}
