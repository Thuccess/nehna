'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  MapPin,
  Phone,
  Share2,
  ShoppingCart,
  Tag,
} from 'lucide-react';
import { useBusiness, useProduct, useProducts } from '@/lib/queries';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/lib/toast';
import { useCart } from '@/providers/CartProvider';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  id: string;
}

export default function ProductDetail({ id }: ProductDetailProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { addItem, openCart } = useCart();
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: biz } = useBusiness(product?.businessId);
  const { data: relatedRaw = [] } = useProducts(
    product?.businessId ? { businessId: product.businessId } : undefined,
  );

  const related = useMemo(
    () => relatedRaw.filter((p) => p.id !== id).slice(0, 3),
    [relatedRaw, id],
  );

  const handleAddToCart = () => {
    if (!product || !biz || !product.isAvailable) return;
    addItem({
      productId: product.id,
      businessId: biz.id,
      businessName: biz.name,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast(language === 'en' ? 'Added to cart' : 'ኣብ ካርት ተወሲኹ', 'success');
    openCart();
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name, url });
        return;
      }
    } catch {
      // user dismissed share sheet — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      toast(language === 'en' ? 'Link copied to clipboard' : 'ሊንክ ተቐዲሑ', 'success');
    } catch {
      toast('Could not copy link.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-black/10 shadow-sm rounded-3xl p-16 text-center max-w-md mx-auto">
        <div className="h-10 w-10 mx-auto mb-3 rounded-full border-2 border-sky-500 border-t-transparent animate-spin"></div>
        <p className="text-black/60 text-sm">
          {language === 'en' ? 'Loading product details…' : 'ኣቕሓ ይጽዓን ኣሎ…'}
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-white border border-black/10 shadow-sm rounded-3xl p-16 text-center max-w-md mx-auto">
        <h3 className="text-base font-black text-black">
          {language === 'en' ? 'Product Not Found' : 'ኣቕሓ ኣይተረኽበን'}
        </h3>
        <p className="text-black/60 text-xs mt-2">
          {language === 'en'
            ? 'This listing may have been removed or is no longer available.'
            : 'እዚ ኣቕሓ ተወጊዱ ወይ ኣይርከብን።'}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 mt-4 text-xs text-sky-600 hover:text-sky-700 font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'en' ? 'Back to Marketplace' : 'ናብ ዕዳጋ ተመለስ'}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10" id={`product-detail-${product.id}`}>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-slate-50 border border-black/10 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover ${
                !product.isAvailable ? 'grayscale opacity-70' : ''
              }`}
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-4 left-4 inline-flex items-center bg-white/95 backdrop-blur-md text-black/85 border border-black/10 text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">
              {product.category}
            </span>
            {!product.isAvailable && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-white/95 text-black/80 border border-black/15 text-xs font-mono uppercase font-black tracking-widest px-5 py-2 rounded-full shadow-lg">
                  {t.markOutOfStock}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-5">
          {biz && (
            <Link
              href={`/businesses/${biz.id}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700 uppercase font-mono tracking-widest"
            >
              <span>{biz.name}</span>
            </Link>
          )}

          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight leading-tight">
              {product.name}
            </h1>
            <button
              type="button"
              onClick={handleShare}
              className="shrink-0 p-2.5 rounded-2xl border border-black/10 hover:border-sky-500/40 hover:bg-sky-50 text-black/60 hover:text-sky-700 transition cursor-pointer"
              aria-label={language === 'en' ? 'Share' : 'ኣካፍል'}
              title={language === 'en' ? 'Share / copy link' : 'ሊንክ ቅዳሕ'}
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <div>
            <span className="text-[10px] uppercase font-black font-mono tracking-widest block text-black/45">
              {language === 'en' ? 'Direct price' : 'ዋጋ'}
            </span>
            <div className="font-mono font-black text-black text-3xl mt-0.5 leading-none">
              UGX {product.price.toLocaleString()}
            </div>
          </div>

          <p className="text-black/70 text-sm leading-relaxed font-sans">{product.description}</p>

          {biz && (
            <div className="bg-slate-50 border border-black/10 p-5 rounded-3xl space-y-3">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={biz.logo}
                  alt={biz.name}
                  className="h-12 w-12 rounded-2xl object-cover bg-white border border-black/10 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-black/55 block font-mono">
                    {language === 'en' ? 'Pick-up location' : 'ቦታ ምውጻእ'}
                  </span>
                  <Link
                    href={`/businesses/${biz.id}`}
                    className="text-black font-serif font-bold text-sm hover:text-sky-700 transition truncate block"
                  >
                    {biz.name}
                  </Link>
                  <div className="text-black/65 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">
                      {biz.neighborhood} — {biz.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${biz.phone}`}
                  title={t.callSeller}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 border border-black/10 hover:border-sky-500/40 hover:bg-white text-black/75 hover:text-sky-700 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0"
                >
                  <Phone className="h-4 w-4" />
                  <span>{language === 'en' ? 'Call' : 'ደውል'}</span>
                </a>
                {product.isAvailable ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-flag-red-600 hover:bg-flag-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow shadow-flag-red-500/20 transition cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{t.addToCart}</span>
                  </button>
                ) : (
                  <span className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 text-black/40 border border-black/5 rounded-2xl text-xs font-black uppercase tracking-wider cursor-not-allowed">
                    <span>{t.markOutOfStock}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2 text-[11px] text-black/55">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              {language === 'en'
                ? 'Direct trade, no middlemen. Verify in person at pick-up.'
                : 'ቀጥታ ንግዲ፣ ብዘይ ዓራዕራዪ። ኣብ ቦታ ምውጻእ ኣረጋግጹ።'}
            </span>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-black text-black tracking-tight flex items-center gap-2">
                <Tag className="h-5 w-5 text-sky-600" />
                <span>
                  {language === 'en' ? 'More from this seller' : 'ካብዚ ሸያጢ ካልእ'}
                </span>
              </h2>
              {biz && (
                <p className="text-xs text-black/55 mt-1">
                  {language === 'en' ? 'Other items by' : 'ካልኦት ኣቑሑት ብ'}{' '}
                  <Link
                    href={`/businesses/${biz.id}`}
                    className="text-sky-600 hover:text-sky-700 font-bold"
                  >
                    {biz.name}
                  </Link>
                </p>
              )}
            </div>
            {biz && relatedRaw.length > related.length + 1 && (
              <Link
                href={`/businesses/${biz.id}`}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold whitespace-nowrap"
              >
                {language === 'en' ? 'View all →' : 'ኩሉ ርአ →'}
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                business={biz}
                variant="grid"
                onAddToCart={(prod) => {
                  if (!biz) return;
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
              />
            ))}
          </div>
        </section>
      )}

      {biz && product.isAvailable && (
        <button
          type="button"
          onClick={handleAddToCart}
          className="md:hidden fixed bottom-mobile-nav left-3 right-3 z-40 btn btn-primary shadow-2xl shadow-flag-red-500/30 w-auto"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{t.addToCart}</span>
        </button>
      )}
    </div>
  );
}
