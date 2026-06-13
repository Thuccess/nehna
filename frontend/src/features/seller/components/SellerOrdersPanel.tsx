'use client';

import { useState } from 'react';
import type { Order } from '@adulis/shared';
import { useOrders } from '@/lib/queries/useOrders';
import { useLanguage } from '@/providers/LanguageProvider';
import OrderThread from '@/components/orders/OrderThread';
import { Package } from 'lucide-react';

export default function SellerOrdersPanel() {
  const { language } = useLanguage();
  const { data: orders = [], isLoading } = useOrders();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  if (isLoading) {
    return <div className="text-sm text-black/60 py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6" id="seller-orders-panel">
      <div>
        <h2 className="text-xl font-serif font-black text-black">
          {language === 'en' ? 'Customer orders' : 'ትእዛዝ ዓማዊል'}
        </h2>
        <p className="text-sm text-black/60 mt-1">
          {language === 'en'
            ? 'Orders submitted from buyer carts. Reply and update status on Nehna.'
            : 'ትእዛዝ ካብ ካርት ዓማዊል። ኣብ Nehna መልሲ ሃቡ።'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-black/10 bg-white p-12 text-center" id="no-orders-warning">
          <Package className="h-10 w-10 text-black/25 mx-auto mb-3" />
          <p className="text-sm text-black/60">
            {language === 'en'
              ? 'No orders yet. When buyers submit their cart, orders appear here.'
              : 'ትእዛዝ ኣይተረኽበን።'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setActiveOrder(order)}
                className={`w-full text-left rounded-2xl border p-4 transition ${
                  activeOrder?.id === order.id
                    ? 'border-flag-green-400 bg-flag-green-50/40'
                    : 'border-black/10 bg-white hover:border-black/20'
                }`}
              >
                <p className="text-sm font-bold text-black">{order.buyerName}</p>
                <p className="text-xs text-black/55">{order.buyerPhone}</p>
                <p className="text-sm font-mono font-black mt-2">
                  UGX {order.totalAmount.toLocaleString()}
                </p>
                <p className="text-[10px] font-mono uppercase text-black/45 mt-1">
                  {order.status} · {order.createdAt}
                </p>
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            {activeOrder ? (
              <OrderThread
                order={activeOrder}
                onOrderUpdated={(updated) => {
                  setActiveOrder(updated);
                }}
              />
            ) : (
              <p className="text-sm text-black/50 py-8 text-center">
                {language === 'en' ? 'Select an order to respond on Nehna' : 'ትእዛዝ ምረጹ'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
