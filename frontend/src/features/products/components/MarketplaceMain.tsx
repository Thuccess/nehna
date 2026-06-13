'use client';

import { useState } from 'react';
import { ShoppingCart, Tag, X } from 'lucide-react';
import type { Business, Favorite, Product } from '@adulis/shared';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/lib/toast';
import { useAddFavorite, useRemoveFavorite } from '@/lib/queries';
import { useCart } from '@/providers/CartProvider';
import ProductCard from './ProductCard';
import MobileBottomSheet from '@/components/layout/MobileBottomSheet';
import { filterMarketplaceProducts } from '@/lib/marketplaceFilters';

interface MarketplaceMainProps {
  products: Product[];
  businesses: Business[];
  favorites: Favorite[];
  searchQuery: string;
  selectedCategory: string;
  selectedLocation: string;
}

export default function MarketplaceMain({
  products,
  businesses,
  favorites,
  searchQuery,
  selectedCategory,
  selectedLocation,
}: MarketplaceMainProps) {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addItem, openCart } = useCart();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  const isFavorite = (itemId: string, type: 'product' | 'business') =>
    favorites.some((f) => f.itemId === itemId && f.itemType === type);

  const handleToggleFavorite = async (itemId: string, type: 'product' | 'business') => {
    if (!user) {
      toast('Sign in to save favorites.', 'info');
      return;
    }
    const fav = isFavorite(itemId, type);
    try {
      if (fav) {
        await removeFavorite.mutateAsync({ itemType: type, itemId });
        toast(t.itemRemovedFav, 'info');
      } else {
        await addFavorite.mutateAsync({ itemType: type, itemId });
        toast(t.itemAddedFav, 'success');
      }
    } catch {
      toast('Could not update favorites.', 'error');
    }
  };

  const filteredProducts = filterMarketplaceProducts(products, businesses, {
    searchQuery,
    selectedCategory,
    selectedLocation,
  });

  const handleAddToCart = (product: Product) => {
    if (!product.isAvailable) return;
    const biz = businesses.find((b) => b.id === product.businessId);
    if (!biz) return;
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

  return (
    <div id="marketplace-main-section" className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-slate-50/90 to-slate-50 border border-black/10 p-6 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/[0.02] to-transparent pointer-events-none"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-500 border border-sky-500/20 px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase tracking-widest mb-1.5">
              <span>{t.navProducts}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-black text-black tracking-tight">
              {language === 'en'
                ? 'Verified Kampala Marketplace'
                : 'ኩሎም ዝተረኽቡ ኣቑሑት ዕዳጋ'}
            </h2>
            <p className="text-black/60 text-xs mt-1">
              {language === 'en'
                ? 'Add to cart and submit orders to sellers on Nehna.'
                : 'ኣብ ካርት ወስኽ ኣብ Nehna ትእዛዝ ሰዲድ።'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-black/5 border border-black/10 px-4 py-2 rounded-2xl text-xs font-mono text-black/90 self-start sm:self-center shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {filteredProducts.length}{' '}
              {language === 'en' ? 'items listed' : 'ዝተረኽቡ ኣቑሑት'}
            </span>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div
          className="bg-white/95 rounded-3xl border border-black/10 p-16 text-center max-w-md mx-auto shadow-2xl"
          id="no-search-results"
        >
          <div className="h-14 w-14 bg-black/5 border border-black/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag className="h-6 w-6 text-black/40" />
          </div>
          <h3 className="text-base font-black text-black uppercase tracking-wide">{t.noMatches}</h3>
          <p className="text-black/60 text-xs mt-2 leading-relaxed">
            Try adjusting your location tags, clear text entries, or switch from traditional foods to services filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-md:gap-3 lg:gap-8">
          {filteredProducts.map((prod) => {
            const biz = businesses.find((b) => b.id === prod.businessId);
            return (
              <ProductCard
                key={prod.id}
                product={prod}
                business={biz}
                variant="grid"
                isFavorite={isFavorite(prod.id, 'product')}
                onToggleFavorite={(id) => handleToggleFavorite(id, 'product')}
                onQuickView={setActiveDetailProduct}
                onAddToCart={handleAddToCart}
              />
            );
          })}
        </div>
      )}

      {activeDetailProduct && (
        <MobileBottomSheet
          open={!!activeDetailProduct}
          onClose={() => setActiveDetailProduct(null)}
          ariaLabel={activeDetailProduct.name}
        >
          <div className="overflow-hidden">
            <div className="relative h-48 sm:h-64 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeDetailProduct.image}
                alt={activeDetailProduct.name}
                className={`w-full h-full object-cover ${
                  !activeDetailProduct.isAvailable ? 'grayscale opacity-70' : ''
                }`}
                referrerPolicy="no-referrer"
              />
              {!activeDetailProduct.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-white/95 text-black/80 border border-black/15 text-[10px] font-mono uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    {t.markOutOfStock}
                  </span>
                </div>
              )}
              <button
                onClick={() => setActiveDetailProduct(null)}
                className="absolute top-4 right-4 p-2 bg-white/95 hover:bg-white text-black/70 hover:text-black rounded-full transition cursor-pointer border border-black/10 shadow-md"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <span className="inline-flex items-center bg-sky-50 text-sky-700 border border-sky-100 text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md font-mono">
                  {activeDetailProduct.category}
                </span>
                <h3 className="text-xl font-serif font-black mt-3 text-black leading-snug">
                  {activeDetailProduct.name}
                </h3>
                <div className="mt-2">
                  <span className="text-[9px] uppercase font-black font-mono tracking-widest block text-black/45">
                    {language === 'en' ? 'Direct price' : 'ዋጋ'}
                  </span>
                  <div className="font-mono font-black text-black text-2xl mt-0.5 leading-none">
                    UGX {activeDetailProduct.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-black/75 text-xs leading-relaxed font-sans border-t border-black/10 pt-4 space-y-3">
                <div>
                  <strong className="text-black block text-xs uppercase tracking-wide mb-1 font-mono">
                    {t.description}
                  </strong>
                  <p className="leading-relaxed text-black/70 font-sans">
                    {activeDetailProduct.description}
                  </p>
                </div>

                {(() => {
                  const biz = businesses.find((b) => b.id === activeDetailProduct.businessId);
                  return biz ? (
                    <div className="bg-slate-50 border border-black/10 p-4 rounded-2xl space-y-2 mt-2">
                      <span className="text-[10px] uppercase font-black tracking-widest text-black/55 block font-mono">
                        {language === 'en' ? 'Pick-up & Location' : 'ቦታ ምውጻእ'}
                      </span>
                      <div className="text-black font-serif font-bold text-sm">{biz.name}</div>
                      <div className="text-black/70 font-sans text-xs flex items-center gap-1">
                        <span>{language === 'en' ? 'Neighborhood:' : 'ከባቢ:'}</span>
                        <strong className="text-sky-700">{biz.neighborhood}</strong>
                      </div>
                      <div className="text-black/70 font-sans text-xs">
                        {language === 'en' ? 'Address:' : 'ኣድራሻ:'}{' '}
                        <span className="text-black/85">{biz.address}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setActiveDetailProduct(null)}
                  className="px-4 py-2.5 border border-black/15 hover:bg-black/5 rounded-2xl text-black/75 text-xs font-bold cursor-pointer transition touch-manipulation"
                >
                  {language === 'en' ? 'Close' : 'ዕጾ'}
                </button>
                <button
                  type="button"
                  disabled={!activeDetailProduct.isAvailable}
                  onClick={() => {
                    handleAddToCart(activeDetailProduct);
                    setActiveDetailProduct(null);
                  }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-lg touch-manipulation ${
                    activeDetailProduct.isAvailable
                      ? 'bg-flag-red-600 hover:bg-flag-red-500 text-white shadow-flag-red-500/20 cursor-pointer'
                      : 'bg-slate-100 text-black/40 border border-black/5 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{t.addToCart}</span>
                </button>
              </div>
            </div>
          </div>
        </MobileBottomSheet>
      )}
    </div>
  );
}
