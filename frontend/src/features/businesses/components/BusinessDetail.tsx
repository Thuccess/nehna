'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, ShoppingCart, Sparkles, Tag } from 'lucide-react';
import { useBusiness, useProducts } from '@/lib/queries';
import { useLanguage } from '@/providers/LanguageProvider';
import { useCart } from '@/providers/CartProvider';
import { useToast } from '@/lib/toast';

interface BusinessDetailProps {
  id: string;
}

export default function BusinessDetail({ id }: BusinessDetailProps) {
  const { language, t } = useLanguage();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();
  const { data: biz, isLoading, isError } = useBusiness(id);
  const { data: products = [] } = useProducts({ businessId: id });

  if (isLoading) {
    return (
      <div className="text-center text-black/60 text-sm py-16">Loading business profile...</div>
    );
  }

  if (isError || !biz) {
    return (
      <div className="bg-white/95 rounded-3xl border border-black/10 p-16 text-center max-w-md mx-auto shadow-2xl">
        <h3 className="text-base font-black text-black">Business Not Found</h3>
        <p className="text-black/60 text-xs mt-2">
          This shop may have been removed or never existed.
        </p>
        <Link
          href="/businesses"
          className="inline-flex items-center gap-1.5 mt-4 text-xs text-sky-500 hover:text-sky-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8" id={`business-detail-${biz.id}`}>
      <div className="relative h-60 md:h-72 w-full overflow-hidden rounded-3xl bg-white border border-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            biz.coverImage ||
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200'
          }
          alt={biz.name}
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          <span className="bg-white/95 backdrop-blur-md text-black border border-black/15 text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-lg">
            📍 {biz.neighborhood}
          </span>
          {biz.package === 'top_featured' && (
            <span className="bg-sky-500 text-black text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <Sparkles className="h-3 w-3" />
              GOLD BRAND
            </span>
          )}
          {biz.status === 'approved' && (
            <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-lg">
              Verified ✓
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start -mt-20 px-2 relative z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={biz.logo}
          alt={biz.name}
          className="h-28 w-28 rounded-3xl object-cover border-2 border-sky-500/40 bg-slate-50 shadow-2xl shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="space-y-2 flex-1 pt-4">
          <span className="inline-block bg-sky-500/10 text-sky-500 border border-sky-500/25 text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-md tracking-wider">
            {biz.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight">
            {biz.name}
          </h1>
          <p className="text-black/75 text-sm leading-relaxed font-sans max-w-2xl">
            {biz.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-3">
            <a
              href={`tel:${biz.phone}`}
              className="inline-flex items-center gap-2 py-2 px-3.5 bg-black/5 hover:bg-black/5 border border-black/15 text-black rounded-2xl text-xs font-bold"
            >
              <Phone className="h-3.5 w-3.5 text-black/75" />
              {biz.phone}
            </a>
            <Link
              href={`/products?category=${encodeURIComponent(biz.category)}&neighborhood=${encodeURIComponent(biz.neighborhood)}`}
              className="inline-flex items-center gap-2 py-2 px-3.5 bg-flag-blue-50 hover:bg-flag-blue-100 border border-flag-blue-200 text-flag-blue-700 rounded-2xl text-xs font-bold"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {language === 'en' ? 'Shop on Nehna' : 'ኣብ Nehna ዕዳግ'}
            </Link>
            <span className="inline-flex items-center gap-2 py-2 px-3.5 bg-black/5 border border-black/10 text-black/75 rounded-2xl text-xs font-mono">
              <MapPin className="h-3.5 w-3.5 text-black/60" />
              {biz.address}
            </span>
          </div>
        </div>
      </div>

      {biz.features && biz.features.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {biz.features.map((feat: string, i: number) => (
            <div
              key={i}
              className="bg-black/5 border border-black/10 text-black/85 px-3 py-2 rounded-xl text-xs font-mono"
            >
              ✨ {feat}
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-black/10 pt-6">
        <h2 className="text-lg md:text-xl font-serif font-black text-black tracking-tight flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-sky-500" />
          <span>
            {language === 'en' ? 'Products & Services' : 'ኣቑሑትን ኣገልግሎት'} ({products.length})
          </span>
        </h2>

        {products.length === 0 ? (
          <div className="bg-white/95 rounded-3xl border border-black/10 p-10 text-center">
            <p className="text-black/60 text-xs">
              {language === 'en'
                ? 'This shop has no active listings yet.'
                : 'ሓደ ዝተወሰነ ኣቕሓ ኣይተመዝገበን።'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white/40 border border-black/10 rounded-3xl shadow-2xl overflow-hidden hover:border-sky-500/40 transition group"
              >
                <div className="h-44 relative bg-white overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 text-black text-[9px] font-mono font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-black/10">
                    {prod.category}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold text-black leading-snug">{prod.name}</h3>
                  <p className="text-black/70 text-xs leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-black/5">
                    <span className="font-mono text-sky-500 font-extrabold text-sm">
                      UGX {prod.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      disabled={!prod.isAvailable}
                      onClick={() => {
                        addItem({
                          productId: prod.id,
                          businessId: biz.id,
                          businessName: biz.name,
                          name: prod.name,
                          price: prod.price,
                          image: prod.image,
                        });
                        toast(language === 'en' ? 'Added to cart' : 'ኣብ ካርት ተወሲኹ', 'success');
                        openCart();
                      }}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-flag-red-50 hover:bg-flag-red-100 border border-flag-red-200 text-flag-red-700 rounded-xl text-[11px] font-bold disabled:opacity-40"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {products.some((p) => p.isAvailable) && (
        <button
          type="button"
          onClick={() => {
            const first = products.find((p) => p.isAvailable);
            if (!first) return;
            addItem({
              productId: first.id,
              businessId: biz.id,
              businessName: biz.name,
              name: first.name,
              price: first.price,
              image: first.image,
            });
            openCart();
          }}
          className="md:hidden fixed bottom-mobile-nav left-3 right-3 z-40 btn btn-primary shadow-2xl shadow-flag-red-500/30 w-auto"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{t.addToCart}</span>
        </button>
      )}
    </div>
  );
}
