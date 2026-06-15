'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBusiness, useProducts } from '@/lib/queries';
import { useLanguage } from '@/providers/LanguageProvider';
import { useCart } from '@/providers/CartProvider';
import { useToast } from '@/lib/toast';
import { useAuth } from '@/providers/AuthProvider';
import { api, ApiError } from '@/lib/api';
import { formatTelUrl, formatWhatsAppUrl } from '@/lib/whatsapp';

interface BusinessDetailProps {
  id: string;
}

export default function BusinessDetail({ id }: BusinessDetailProps) {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: biz, isLoading, isError } = useBusiness(id);
  const { data: products = [] } = useProducts({ businessId: id });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: reviewData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => api.listBusinessReviews(id),
  });

  const reviewMutation = useMutation({
    mutationFn: () => api.createBusinessReview(id, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      toast(language === 'en' ? 'Review submitted.' : 'ርእይቶ ተመዝጊቡ።', 'success');
      setComment('');
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : 'Failed';
      toast(msg, 'error');
    },
  });

  if (isLoading) {
    return (
      <div className="text-center text-black/60 text-sm py-16">Loading business profile...</div>
    );
  }

  if (isError || !biz) {
    return (
      <div className="bg-white/95 rounded-3xl border border-black/10 p-16 text-center max-w-md mx-auto shadow-2xl">
        <h3 className="text-base font-black text-black">Business Not Found</h3>
        <Link
          href="/businesses"
          className="inline-flex items-center gap-1.5 mt-4 text-xs text-sky-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  const gallery = [
    ...(biz.galleryImages ?? []),
    ...(biz.galleryImages?.length ? [] : [biz.coverImage, biz.logo]),
  ].filter(Boolean);

  const waUrl = formatWhatsAppUrl(
    biz.whatsAppNumber,
    `Hello ${biz.name}, I found you on Nehna.`,
  );
  const reviews = reviewData?.reviews ?? [];
  const stats = reviewData?.stats ?? { average: 0, count: 0 };

  return (
    <div className="space-y-10" id={`business-detail-${biz.id}`}>
      {/* Hero */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          <span className="bg-white/95 text-black border border-black/15 text-[10px] font-mono font-black uppercase px-3 py-1 rounded-lg">
            📍 {biz.neighborhood}
          </span>
          {biz.package === 'top_featured' && (
            <span className="bg-sky-500 text-black text-[10px] uppercase font-black px-3 py-1 rounded-lg flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              GOLD BRAND
            </span>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start -mt-20 px-2 relative z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={biz.logo}
          alt={biz.name}
          className="h-28 w-28 rounded-3xl object-cover border-2 border-sky-500/40 bg-slate-50 shadow-2xl shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="space-y-3 flex-1 pt-4">
          <span className="inline-block bg-sky-500/10 text-sky-500 border border-sky-500/25 text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-md">
            {biz.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight">
            {biz.name}
          </h1>
          {stats.count > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 text-flag-gold-500 fill-flag-gold-500" />
              <span className="font-bold">{stats.average.toFixed(1)}</span>
              <span className="text-black/50">({stats.count} reviews)</span>
            </div>
          )}
          <p className="text-black/75 text-sm leading-relaxed max-w-2xl">{biz.description}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href={formatTelUrl(biz.phone)}
              className="inline-flex items-center gap-2 py-2.5 px-4 bg-black/5 border border-black/15 text-black rounded-2xl text-xs font-bold hover:bg-black/10"
            >
              <Phone className="h-4 w-4" />
              {language === 'en' ? 'Call' : 'ደውል'}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#25D366] text-white rounded-2xl text-xs font-bold hover:bg-[#20bd5a]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Photos */}
      {gallery.length > 0 && (
        <section>
          <h2 className="text-lg font-serif font-black text-black mb-4">
            {language === 'en' ? 'Photos' : 'ስእሊ'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.slice(0, 8).map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt=""
                className="rounded-2xl h-32 w-full object-cover border border-black/10"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="border-t border-black/10 pt-6">
        <h2 className="text-lg font-serif font-black text-black flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-sky-500" />
          {language === 'en' ? 'Products & Services' : 'ኣቑሑት'} ({products.length})
        </h2>
        {products.length === 0 ? (
          <p className="text-black/60 text-sm text-center py-8">
            {language === 'en' ? 'No listings yet.' : 'ኣቕሓ ኣይተመዝገበን።'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-black/10 rounded-3xl overflow-hidden hover:border-sky-500/40 transition group"
              >
                <div className="h-44 relative bg-white overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold text-black">{prod.name}</h3>
                  <p className="text-black/70 text-xs line-clamp-2">{prod.description}</p>
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
                        openCart();
                        toast(language === 'en' ? 'Added to cart' : 'ኣብ ካርት ተወሲኹ', 'success');
                      }}
                      className="text-xs font-bold text-sky-600 hover:underline disabled:opacity-50"
                    >
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Location & Hours */}
      <section className="grid md:grid-cols-2 gap-6 border-t border-black/10 pt-6">
        <div className="bg-slate-50 border border-black/10 rounded-2xl p-5 space-y-3">
          <h2 className="font-bold text-black flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sky-500" />
            {language === 'en' ? 'Location' : 'ኣካባቢ'}
          </h2>
          <p className="text-sm text-black/70">{biz.address}</p>
          <p className="text-xs font-mono text-black/50">{biz.neighborhood}</p>
          {biz.mapsUrl && (
            <a
              href={biz.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {language === 'en' ? 'Open in Maps' : 'ካርታ ክፈት'}
            </a>
          )}
        </div>
        {biz.openingHours && (
          <div className="bg-slate-50 border border-black/10 rounded-2xl p-5 space-y-3">
            <h2 className="font-bold text-black flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-500" />
              {language === 'en' ? 'Opening hours' : 'ሰዓት ክፍትሒ'}
            </h2>
            <p className="text-sm text-black/70 whitespace-pre-line">{biz.openingHours}</p>
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="border-t border-black/10 pt-6 space-y-4">
        <h2 className="text-lg font-serif font-black text-black">
          {language === 'en' ? 'Reviews' : 'ርእይቶታት'}
        </h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-black/50">
            {language === 'en' ? 'No reviews yet.' : 'ርእይቶ ኣይተመዝገበን።'}
          </p>
        ) : (
          <ul className="space-y-3 max-w-2xl">
            {reviews.map((r) => (
              <li key={r.id} className="bg-white border border-black/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{r.userName}</span>
                  <span className="text-flag-gold-500 text-xs">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                </div>
                <p className="text-sm text-black/70">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
        {user && (user.role === 'customer' || user.role === 'admin') && (
          <form
            className="max-w-md space-y-3 bg-slate-50 border border-black/10 rounded-2xl p-4"
            onSubmit={(e) => {
              e.preventDefault();
              reviewMutation.mutate();
            }}
          >
            <label className="block text-xs font-bold text-black/70">
              {language === 'en' ? 'Your rating' : 'ደረጃኻ'}
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              placeholder={language === 'en' ? 'Share your experience…' : 'ልምዲኻ ኣካፍል…'}
              className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={reviewMutation.isPending}
              className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold disabled:opacity-60"
            >
              {language === 'en' ? 'Submit review' : 'ርእይቶ ሰዲድ'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
