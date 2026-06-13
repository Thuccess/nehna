'use client';

import { useState } from 'react';
import type { Order } from '@adulis/shared';
import { useOrders } from '@/lib/queries/useOrders';
import { useLanguage } from '@/providers/LanguageProvider';
import OrderThread from '@/components/orders/OrderThread';
import { Package } from 'lucide-react';

export default function MyOrdersView() {
  const { language } = useLanguage();
  const { data: orders = [], isLoading } = useOrders();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [ordersState, setOrdersState] = useState<Order[]>([]);

  const displayOrders = ordersState.length ? ordersState : orders;

  const handleOrderUpdated = (updated: Order) => {
    setOrdersState((prev) => {
      const base = prev.length ? prev : orders;
      return base.map((o) => (o.id === updated.id ? updated : o));
    });
    if (activeOrder?.id === updated.id) setActiveOrder(updated);
  };

  if (isLoading) {
    return <div className="text-sm text-black/60 py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-black text-black">
          {language === 'en' ? 'My orders on Nehna' : 'ትእዛዛተይ ኣብ Nehna'}
        </h1>
        <p className="text-sm text-black/60 mt-1">
          {language === 'en'
            ? 'Track orders and message sellers directly on the platform.'
            : 'ትእዛዝኩም ተኸታተልኩም ሸያጢ ብመድረኽ ርክብ ግበሩ።'}
        </p>
      </div>

      {displayOrders.length === 0 ? (
        <div className="rounded-3xl border border-black/10 bg-white p-12 text-center">
          <Package className="h-10 w-10 text-black/25 mx-auto mb-3" />
          <p className="text-sm text-black/60">
            {language === 'en' ? 'No orders yet. Add items to your cart from the marketplace.' : 'ትእዛዝ ኣይተረኽበን።'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {displayOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setActiveOrder(order)}
                className={`w-full text-left rounded-2xl border p-4 transition ${
                  activeOrder?.id === order.id
                    ? 'border-flag-blue-400 bg-flag-blue-50/50'
                    : 'border-black/10 bg-white hover:border-black/20'
                }`}
              >
                <p className="text-xs font-mono font-bold text-flag-blue-700">{order.businessName}</p>
                <p className="text-sm font-bold text-black mt-1">
                  UGX {order.totalAmount.toLocaleString()} · {order.items.length} items
                </p>
                <p className="text-[10px] font-mono uppercase text-black/45 mt-1">
                  {order.status} · {order.createdAt}
                </p>
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            {activeOrder ? (
              <OrderThread order={activeOrder} onOrderUpdated={handleOrderUpdated} />
            ) : (
              <p className="text-sm text-black/50 py-8 text-center">
                {language === 'en' ? 'Select an order to view Nehna messages' : 'ትእዛዝ ምረጹ'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
