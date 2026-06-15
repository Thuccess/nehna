'use client';

import Link from 'next/link';
import { Inbox, Phone, Building, Clock } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useBusinesses, useMyInquiries, useProducts } from '@/lib/queries';

export default function MyInquiriesView() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { data: inquiries = [], isLoading } = useMyInquiries(Boolean(user));
  const { data: products = [] } = useProducts();
  const { data: businesses = [] } = useBusinesses({ status: 'all' });

  if (!user) return null;

  return (
    <div className="space-y-5">
      <div className="border-b border-black/10 pb-3">
        <h2 className="text-xl font-serif font-bold text-black uppercase tracking-tight flex items-center gap-2">
          <Inbox className="h-5 w-5 text-sky-600" />
          <span>{language === 'en' ? 'My Inquiries' : 'ሕቶታተይ'}</span>
        </h2>
        <p className="text-xs text-black/60 mt-1">
          {language === 'en'
            ? 'A history of every message you sent to a seller through Nehna.'
            : 'ናብ ሸቓጦ ዝለኣኽካዮም ኩሎም መልእኽትታት።'}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-black/55 text-sm py-12">Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-3xl p-10 text-center max-w-md mx-auto shadow-sm">
          <Inbox className="h-10 w-10 text-black/20 mx-auto mb-3" />
          <p className="text-black/55 text-sm">
            {language === 'en'
              ? "You haven't reached out to any seller yet."
              : 'ገና ናብ ሓደ ሸቓጢ ሕቶ ኣይለኣኽካን።'}
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 px-4 py-2 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-xl font-extrabold text-xs cursor-pointer transition-all"
          >
            {language === 'en' ? 'Browse Marketplace' : 'ኣብ ዕዳጋ ድለ'}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {inquiries.map((inq) => {
            const product = inq.productId ? products.find((p) => p.id === inq.productId) : null;
            const business = businesses.find((b) => b.id === inq.businessId);
            return (
              <li
                key={inq.id}
                className="bg-white border border-black/10 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-sky-200 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {inq.status === 'unread'
                          ? language === 'en'
                            ? 'Awaiting reply'
                            : 'ምላሽ ይጽበ'
                          : language === 'en'
                            ? 'Read by seller'
                            : 'ተነቢቡ'}
                      </span>
                      <span className="text-black/50 font-mono inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {inq.createdAt}
                      </span>
                    </div>
                    {business && (
                      <p className="text-sm font-bold text-black inline-flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-black/55" />
                        {business.name}
                      </p>
                    )}
                    {product && (
                      <p className="text-xs text-black/65">
                        {language === 'en' ? 'About' : 'ብዛዕባ'}{' '}
                        <span className="font-bold text-black/85">{product.name}</span>
                      </p>
                    )}
                    <p className="text-sm text-black/85 leading-relaxed">{inq.message}</p>
                  </div>

                  {business && (
                    <Link
                      href="/dashboard/orders"
                      className="self-start inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-extrabold bg-flag-blue-600 hover:bg-flag-blue-500 text-white transition shrink-0"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{language === 'en' ? 'Message on Nehna' : 'ኣብ Nehna መልእኽቲ'}</span>
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
