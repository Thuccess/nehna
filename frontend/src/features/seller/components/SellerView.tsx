'use client';

import Link from 'next/link';
import { Briefcase, Clock, Store } from 'lucide-react';
import SellersHub from './SellersHub';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { isPending } from '@/lib/userStatus';
import { useBusinesses, useInquiries, useProducts } from '@/lib/queries';

export default function SellerView({ initialTab }: { initialTab?: 'businesses' | 'products' | 'inquiries' }) {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const { data: businesses = [], isLoading: bLoading } = useBusinesses({
    status: 'all',
    ownerId: user?.id,
  });
  const { data: products = [], isLoading: pLoading } = useProducts();
  const { data: inquiries = [] } = useInquiries();

  if (!user) {
    return (
      <div className="bg-slate-50 p-12 text-center rounded-2xl border border-black/10 max-w-md mx-auto">
        <Briefcase className="h-10 w-10 text-black/20 mx-auto mb-3" />
        <h3 className="text-base font-black text-black mb-1">
          {language === 'en' ? 'Sign in to access the Seller Hub' : 'ኣብ ማእከል ነጋዶ ንምእታው'}
        </h3>
        <p className="text-black/55 text-xs leading-relaxed">
          {language === 'en'
            ? 'Register as a seller or sign in after admin approval.'
            : 'ከም ሸያጢ መዝግብ ወይ ኣብ ድሕሪ ምጽዳቕ እተው።'}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link
            href="/login/seller"
            className="px-4 py-2 bg-flag-red-600 hover:bg-flag-red-500 text-white font-extrabold rounded-xl text-xs"
          >
            {t.loginBtn}
          </Link>
          <Link
            href="/register/seller"
            className="px-4 py-2 border border-black/15 hover:bg-black/5 text-black font-bold rounded-xl text-xs"
          >
            {language === 'en' ? 'Register as seller' : 'ከም ሸያጢ መዝግብ'}
          </Link>
        </div>
      </div>
    );
  }

  if (isPending(user)) {
    return (
      <div className="bg-slate-50 p-10 text-center rounded-2xl border border-black/10 max-w-lg mx-auto space-y-4">
        <Clock className="h-12 w-12 text-flag-gold-600 mx-auto" />
        <h3 className="text-lg font-black text-black">
          {language === 'en' ? 'Account pending approval' : 'ኣካውንት ኣብ ምጽዳቕ'}
        </h3>
        <p className="text-black/60 text-sm leading-relaxed">
          {language === 'en'
            ? 'An administrator must approve your seller account before you can sign in and manage your shop.'
            : 'ኣካውንትኩም ክኣተወ ኣድማሪ ክጽድቕ እዩ።'}
        </p>
      </div>
    );
  }

  if (bLoading || pLoading) {
    return <div className="text-center text-black/60 text-sm py-16">Loading seller hub...</div>;
  }

  if (businesses.length === 0) {
    return (
      <div className="bg-slate-50 p-10 text-center rounded-2xl border border-black/10 max-w-lg mx-auto space-y-4">
        <Store className="h-12 w-12 text-black/20 mx-auto" />
        <h3 className="text-lg font-black text-black">
          {language === 'en' ? 'No business profile' : 'መዝገብ ትካል ኣይተረኽበን'}
        </h3>
        <p className="text-black/60 text-sm leading-relaxed">
          {language === 'en'
            ? 'Complete seller registration to submit your business for approval.'
            : 'ድኳንኩም ንምልዓል ከም ሸያጢ መዝግብ።'}
        </p>
        <Link
          href="/register/seller"
          className="inline-flex items-center justify-center px-6 py-3 bg-flag-red-600 hover:bg-flag-red-500 text-white font-extrabold rounded-xl text-sm min-h-[44px] touch-manipulation"
        >
          {language === 'en' ? 'Register as seller' : 'ከም ሸያጢ መዝግብ'}
        </Link>
      </div>
    );
  }

  return (
    <SellersHub
      currentUser={user}
      businesses={businesses}
      products={products}
      inquiries={inquiries}
      initialTab={initialTab}
    />
  );
}
