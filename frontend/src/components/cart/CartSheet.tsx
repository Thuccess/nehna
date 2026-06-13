'use client';

import { Minus, Plus, LogIn, Send, ShoppingBag, Trash2, X } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';
import type { CartLine } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useCreateOrder } from '@/lib/queries/useOrders';
import { useToast } from '@/lib/toast';
import { isPending } from '@/lib/userStatus';
import MobileBottomSheet from '@/components/layout/MobileBottomSheet';

export default function CartSheet() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const canSubmitOrders = Boolean(user && !isPending(user) && user.role === 'customer');
  const createOrder = useCreateOrder();
  const {
    items,
    itemCount,
    totalAmount,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearBusiness,
    clearCart,
  } = useCart();

  const businessGroups = items.reduce<Record<string, CartLine[]>>((acc, item) => {
    const list = acc[item.businessId] ?? [];
    list.push(item);
    acc[item.businessId] = list;
    return acc;
  }, {});

  const submitBusinessOrder = async (businessId: string, businessItems: typeof items) => {
    if (!user) return;
    if (isPending(user)) {
      toast(
        language === 'en'
          ? 'Your account is pending approval. You cannot submit orders yet.'
          : 'ኣካውንትኩም ኣብ ምጽዳቕ ይጽበ።',
        'error',
      );
      return;
    }
    try {
      await createOrder.mutateAsync({
        businessId,
        items: businessItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        note:
          language === 'en'
            ? `Nehna order from ${businessItems[0]?.businessName}`
            : `Nehna ትእዛዝ ካብ ${businessItems[0]?.businessName}`,
      });
      clearBusiness(businessId);
      toast(
        language === 'en' ? 'Order sent to seller on Nehna' : 'ትእዛዝ ናብ ሸያጢ ብ Nehna ተላኢኹ',
        'success',
      );
    } catch {
      toast(language === 'en' ? 'Could not submit order' : 'ትእዛዝ ክትሰዲ ኣይከኣለን', 'error');
    }
  };

  return (
    <MobileBottomSheet open={isOpen} onClose={closeCart} ariaLabel={t.navCart}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-flag-blue-600" />
            <h2 className="text-lg font-serif font-black text-black">
              {language === 'en' ? 'Your cart' : 'ካርትኩም'}
            </h2>
            {itemCount > 0 && (
              <span className="text-xs font-mono font-bold bg-flag-blue-50 text-flag-blue-700 px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-black/5"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-black/60 py-8 text-center">
            {language === 'en' ? 'Your cart is empty. Add items from the marketplace.' : 'ካርትኩም ባዶ እዩ።'}
          </p>
        ) : (
          <>
            {Object.entries(businessGroups).map(([businessId, businessItems]) => {
              const groupTotal = businessItems.reduce((s, i) => s + i.price * i.quantity, 0);
              return (
                <div
                  key={businessId}
                  className="rounded-2xl border border-black/10 bg-white p-4 space-y-3"
                >
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-flag-blue-700">
                    {businessItems[0]?.businessName}
                  </p>
                  <ul className="space-y-3">
                    {businessItems.map((item) => (
                      <li key={item.productId} className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt=""
                          className="h-14 w-14 rounded-xl object-cover border border-black/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black truncate">{item.name}</p>
                          <p className="text-xs font-mono text-black/55">
                            UGX {item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="h-8 w-8 rounded-lg border border-black/10 flex items-center justify-center"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-sm font-mono font-bold w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="h-8 w-8 rounded-lg border border-black/10 flex items-center justify-center"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="ml-auto p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-2 border-t border-black/10">
                    <span className="text-xs font-mono text-black/60">
                      UGX {groupTotal.toLocaleString()}
                    </span>
                    {canSubmitOrders ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        icon={Send}
                        disabled={createOrder.isPending}
                        onClick={() => submitBusinessOrder(businessId, businessItems)}
                      >
                        {t.submitOrderBtn}
                      </Button>
                    ) : !user ? (
                      <ButtonLink
                        href="/login/buyer?next=/"
                        onClick={closeCart}
                        size="sm"
                        variant="secondary"
                        icon={LogIn}
                      >
                        {t.loginBtn}
                      </ButtonLink>
                    ) : (
                      <span className="text-[10px] font-bold text-flag-gold-700 bg-flag-gold-50 border border-flag-gold-200 px-2 py-1 rounded-lg">
                        {language === 'en' ? 'Pending approval' : 'ምጽዳቕ ይጽበ'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between text-sm font-mono font-bold">
              <span>{language === 'en' ? 'Cart total' : 'ጠቕላላ'}</span>
              <span>UGX {totalAmount.toLocaleString()}</span>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="w-full py-2 text-xs font-bold text-black/50 hover:text-rose-600"
            >
              {language === 'en' ? 'Clear cart' : 'ካርት ንጹር'}
            </button>
          </>
        )}
      </div>
    </MobileBottomSheet>
  );
}
