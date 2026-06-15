'use client';

import Link from 'next/link';
import { MapPin, MessageCircle, Phone, ShoppingBag } from 'lucide-react';
import type { Business } from '@adulis/shared';
import { formatTelUrl, formatWhatsAppUrl } from '@/lib/whatsapp';

interface BusinessCardProps {
  biz: Business;
  productCount: number;
  language: 'en' | 'ti';
}

export default function BusinessCard({ biz, productCount, language }: BusinessCardProps) {
  return (
    <div className="bg-white/40 border border-black/10 rounded-3xl shadow-2xl flex flex-col justify-between hover:border-sky-500/40 hover:shadow-sky-500/[0.02] transition-all duration-300 group overflow-hidden">
      <div className="h-32 w-full relative bg-white overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            biz.coverImage ||
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800'
          }
          alt={`${biz.name} Cover`}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>
        <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-black border border-black/15 text-[9px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-lg">
          📍 {biz.neighborhood}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          <div className="flex items-start gap-3.5 -mt-14 relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={biz.logo}
              alt={biz.name}
              className="h-18 w-18 rounded-2xl object-cover border-2 border-black/15 bg-white shrink-0 shadow-lg group-hover:border-sky-500 transition duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="pt-8">
              <span className="inline-block bg-sky-500/10 text-sky-500 border border-sky-500/25 text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded-md tracking-wider">
                {biz.category}
              </span>
              <h3 className="font-extrabold text-black text-base font-sans tracking-tight leading-tight mt-1 group-hover:text-sky-500 transition-colors">
                <Link href={`/businesses/${biz.id}`}>{biz.name}</Link>
              </h3>
            </div>
          </div>

          <p className="text-xs text-black/75 leading-relaxed line-clamp-3 font-sans">
            {biz.description}
          </p>

          <div className="pt-4 space-y-2 text-xs text-black/60 font-sans border-t border-black/5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-black/55 uppercase tracking-wider">
                {language === 'en' ? 'Catalog size' : 'ዝርዝር ኣቑሑት'}:
              </span>
              <span className="text-sky-500 font-extrabold bg-white px-2.5 py-1 rounded-md border border-black/10">
                {productCount}{' '}
                {productCount === 1
                  ? language === 'en'
                    ? 'item listed'
                    : 'ሓደ ኣቕሓ'
                  : language === 'en'
                    ? 'active items'
                    : 'ኣቑሑት'}
              </span>
            </div>

            <div className="flex items-start gap-1.5 text-black/70">
              <MapPin className="h-4 w-4 shrink-0 text-black/40" />
              <span className="line-clamp-1">{biz.address}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-black/5 flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-2">
          <a
            href={formatTelUrl(biz.phone)}
            className="py-2.5 text-center bg-black/5 hover:bg-black/5 border border-black/15 text-black rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Phone className="h-3.5 w-3.5 text-black/50" />
            <span>{language === 'en' ? 'Call' : 'ደውል'}</span>
          </a>
          <a
            href={formatWhatsAppUrl(biz.whatsAppNumber, `Hello ${biz.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 text-center bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <Link
            href={`/businesses/${biz.id}`}
            className="py-2.5 text-center bg-flag-blue-50 hover:bg-flag-blue-100 border border-flag-blue-200 text-flag-blue-700 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'View shop' : 'ድኳን ርአ'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
