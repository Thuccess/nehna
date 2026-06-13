'use client';

import Link from 'next/link';
import { Eye, Heart, MapPin, Phone, ShoppingCart, Sparkles } from 'lucide-react';
import type { Business, Product } from '@adulis/shared';
import { useLanguage } from '@/providers/LanguageProvider';

type Variant = 'grid' | 'compact';

interface ProductCardProps {
  product: Product;
  business?: Business;
  variant?: Variant;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  business,
  variant = 'grid',
  isFavorite = false,
  onToggleFavorite,
  onQuickView,
  onAddToCart,
}: ProductCardProps) {
  const { language, t } = useLanguage();
  const isCompact = variant === 'compact';
  const isSponsored = !!product.isSponsored && !isCompact;

  return (
    <article
      id={`product-card-${product.id}`}
      className={`relative bg-white rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
        isSponsored
          ? 'border border-flag-gold-500/40 ring-2 ring-flag-gold-500/25 shadow-lg shadow-flag-gold-500/15 hover:shadow-xl hover:shadow-flag-gold-500/25'
          : 'border border-black/10 shadow-sm hover:shadow-xl hover:border-sky-500/40'
      }`}
    >
      <div
        className={`relative overflow-hidden bg-slate-50 shrink-0 ${
          isCompact ? 'aspect-[5/3]' : 'aspect-[4/3]'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            !product.isAvailable ? 'grayscale opacity-70' : 'md:group-hover:scale-105'
          }`}
          referrerPolicy="no-referrer"
        />

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span className="inline-flex items-center bg-white/95 backdrop-blur-md text-black/85 text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg font-mono border border-black/10 shadow-sm">
            {product.category}
          </span>
          {business && (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-black/75 text-[9px] uppercase font-bold font-mono px-2.5 py-1 rounded-lg border border-black/10 shadow-sm">
              <MapPin className="h-3 w-3 text-sky-600" />
              <span>{business.neighborhood}</span>
            </span>
          )}
        </div>

        {isSponsored && (
          <span className="absolute top-3 right-12 inline-flex items-center gap-1 bg-gradient-to-r from-flag-gold-500 to-flag-gold-600 text-black text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg shadow-lg z-10">
            <Sparkles className="h-3 w-3 fill-current" />
            <span>FEATURED</span>
          </span>
        )}

        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(product.id)}
            className={`absolute top-3 right-3 p-2 rounded-full cursor-pointer transition-all z-10 shadow-md backdrop-blur-md ${
              isFavorite
                ? 'bg-rose-500 text-white border border-rose-500 hover:bg-rose-400'
                : 'bg-white/95 text-black/60 hover:text-rose-500 border border-black/10'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {!isCompact && onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white text-black/70 hover:text-black border border-black/10 shadow-md backdrop-blur-md cursor-pointer transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10 touch-manipulation"
            aria-label="Quick view"
            title="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-black/80 border border-black/15 text-[10px] font-mono uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              {t.markOutOfStock}
            </span>
          </div>
        )}
      </div>

      <div className={`flex-1 flex flex-col justify-between ${isCompact ? 'p-4 space-y-3' : 'p-5 space-y-4'}`}>
        <div className="space-y-1.5">
          {business && (
            <Link
              href={`/businesses/${business.id}`}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-600 hover:text-sky-700 uppercase font-mono tracking-widest truncate max-w-full"
            >
              <span>{business.name}</span>
            </Link>
          )}
          <h3
            className={`font-bold text-black leading-snug group-hover:text-sky-600 transition-colors ${
              isCompact ? 'text-sm' : 'text-base'
            }`}
          >
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          <p
            className={`text-black/65 leading-relaxed ${
              isCompact ? 'text-[11px] line-clamp-2' : 'text-xs line-clamp-3'
            }`}
          >
            {product.description}
          </p>
        </div>

        <div className={`pt-3 border-t border-black/5 ${isCompact ? 'space-y-3' : 'space-y-3'}`}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="text-[9px] uppercase font-black font-mono tracking-widest block text-black/45">
                {language === 'en' ? 'Direct price' : 'ዋጋ'}
              </span>
              <span
                className={`font-mono font-black text-black leading-none ${
                  isCompact ? 'text-base' : 'text-xl'
                }`}
              >
                UGX {product.price.toLocaleString()}
              </span>
            </div>
          </div>

          {business && (
            <div className="flex items-center gap-2">
              <a
                href={`tel:${business.phone}`}
                title={t.callSeller}
                aria-label={t.callSeller}
                className="p-2.5 border border-black/10 hover:border-sky-500/40 hover:bg-sky-50 text-black/70 hover:text-sky-700 rounded-2xl transition-all shrink-0 cursor-pointer"
              >
                <Phone className="h-4 w-4" />
              </a>

              {onAddToCart ? (
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  disabled={!product.isAvailable}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    product.isAvailable
                      ? 'bg-flag-red-600 hover:bg-flag-red-500 text-white shadow shadow-flag-red-500/20'
                      : 'bg-slate-100 text-black/40 cursor-not-allowed border border-black/5'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{t.addToCart}</span>
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
