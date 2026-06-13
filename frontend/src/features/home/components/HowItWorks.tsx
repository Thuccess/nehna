'use client';

import { Compass, MessageCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function HowItWorks() {
  const { language } = useLanguage();

  const steps = [
    {
      n: '01',
      Icon: Compass,
      title: language === 'en' ? 'Browse the marketplace' : 'ኣብ ዕዳጋ ድለ',
      body:
        language === 'en'
          ? 'Filter by neighborhood and category to find authentic Eritrean shops, restaurants, salons, and rooms.'
          : 'ብ ዓዳጋን ዓይነትን ኣጥራዪ።',
      tone: 'sky',
    },
    {
      n: '02',
      Icon: MessageCircle,
      title: language === 'en' ? 'Message the seller' : 'ናብ ሸቃጢ ላኣኽ',
      body:
        language === 'en'
          ? 'Add items to your cart and message the seller on Nehna. No commissions.'
          : 'ኣብ ካርት ወስኽ ኣብ Nehna ርክብ ግበር።',
      tone: 'emerald',
    },
    {
      n: '03',
      Icon: ShieldCheck,
      title: language === 'en' ? 'Buy with confidence' : 'ብዕግበት ግዛእ',
      body:
        language === 'en'
          ? 'Every seller is admin-verified. Look for the verified badge next to their name.'
          : 'ኩሉ ሸቓጢ ብኣመሓዳሪ ይስልጥን።',
      tone: 'flag-red',
    },
  ] as const;

  const toneClass: Record<(typeof steps)[number]['tone'], string> = {
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'flag-red': 'bg-flag-red-50 text-flag-red-700 border-flag-red-200',
  };

  return (
    <section className="py-10 md:py-12 bg-white border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 bg-black/5 text-black/65 border border-black/10 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
            {language === 'en' ? 'How NehnaX works' : 'NehnaX ከመይ ይሰርሕ'}
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-black text-black tracking-tight mt-3">
            {language === 'en'
              ? 'Three steps to connect with the community'
              : 'ሰለስተ ስጉምቲ ናብ ማሕበረሰብ'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-white border border-black/10 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-black/15 transition flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-11 w-11 rounded-2xl border flex items-center justify-center ${toneClass[s.tone]}`}
                >
                  <s.Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-mono font-black text-black/30">{s.n}</span>
              </div>
              <h3 className="text-base font-serif font-extrabold text-black tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm text-black/65 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
