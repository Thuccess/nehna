'use client';

import { Clock } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';

export default function PendingBanner() {
  const { user } = useAuth();
  const { language } = useLanguage();

  if (!user || user.status !== 'pending') return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start sm:items-center gap-3 text-xs sm:text-sm">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 border border-amber-200 text-amber-700">
          <Clock className="h-3.5 w-3.5" />
        </span>
        <p className="leading-snug">
          <span className="font-extrabold">
            {language === 'en' ? 'Awaiting admin approval.' : 'ምጽዳቕ ኣመሓዳሪ ይጽበ።'}
          </span>{' '}
          <span className="text-amber-800/85">
            {language === 'en'
              ? 'You can browse the marketplace, but messaging, favorites, and selling are paused until your account is verified.'
              : 'ኣብ ዕዳጋ ክትዕይ ትኽእል፤ ግን መልእኽቲ፣ ምድላይ፣ ሽያጥ ጊዜ ምጽዳቕ ጊዚያውያን ስርሕ ኣሎዉ።'}
          </span>
        </p>
      </div>
    </div>
  );
}
