'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/lib/toast';
import {
  useBusinesses,
  useFavorites,
  useProducts,
  useRemoveFavorite,
} from '@/lib/queries';
import ProductCard from '@/features/products/components/ProductCard';

export default function FavoritesView() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const removeFavorite = useRemoveFavorite();

  const { data: favorites = [], isLoading } = useFavorites();
  const { data: products = [] } = useProducts();
  const { data: businesses = [] } = useBusinesses({ status: 'all' });

  if (!user) {
    return (
      <div className="bg-white p-12 text-center rounded-3xl border border-black/10 shadow-sm max-w-sm mx-auto">
        <Heart className="h-10 w-10 text-black/20 mx-auto mb-3 animate-pulse" />
        <p className="text-black/75 text-sm">
          {language === 'en'
            ? 'Sign in to save and view favorites.'
            : 'መሰል ምድላይ ንምዕቃብ እተወ።'}
        </p>
        <Link
          href="/login/buyer?next=/favorites"
          className="inline-block mt-4 px-4 py-2 bg-flag-red-600 hover:bg-flag-red-500 text-white font-extrabold rounded-xl text-xs cursor-pointer transition-all"
        >
          {t.loginBtn}
        </Link>
      </div>
    );
  }

  const handleRemove = async (itemId: string) => {
    try {
      await removeFavorite.mutateAsync({ itemType: 'product', itemId });
      toast(t.itemRemovedFav, 'info');
    } catch {
      toast('Could not remove favorite.', 'error');
    }
  };

  const productFavorites = favorites
    .filter((f) => f.itemType === 'product')
    .map((f) => products.find((p) => p.id === f.itemId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="space-y-6" id="viewspace-favorites">
      <div className="border-b border-black/10 pb-3">
        <h2 className="text-xl font-serif font-bold text-black uppercase tracking-tight flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500 fill-current" />
          <span>{t.navFavorites}</span>
        </h2>
        <p className="text-xs text-black/60 mt-1">
          {language === 'en'
            ? 'Your customized catalog of loved traditional meals, properties, and community offerings.'
            : 'ናትኩም ዝፈተኹሞም ባህላዊ ምግቢ፣ ገዛውቲን ካልኦት ኣቑሑትን።'}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-black/60 text-sm py-10">Loading favorites...</div>
      ) : productFavorites.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-black/10 shadow-sm max-w-sm mx-auto">
          <Heart className="h-10 w-10 text-black/20 mx-auto mb-3 animate-pulse" />
          <p className="text-black/55 text-xs leading-relaxed">{t.favoritesEmpty}</p>
          <Link
            href="/products"
            className="inline-block mt-4 px-4 py-2 bg-flag-red-600 hover:bg-flag-red-500 text-white font-extrabold rounded-xl text-xs cursor-pointer transition-all"
          >
            {language === 'en' ? 'Browse Marketplace' : 'ኣብ ዕዳጋ ድለ'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:gap-3">
          {productFavorites.map((prod) => {
            const biz = businesses.find((b) => b.id === prod.businessId);
            return (
              <ProductCard
                key={prod.id}
                product={prod}
                business={biz}
                variant="compact"
                isFavorite
                onToggleFavorite={handleRemove}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
