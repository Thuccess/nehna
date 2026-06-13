'use client';

import { useEffect, useRef, useState } from 'react';
import type { Order, OrderStatus } from '@adulis/shared';
import {
  useOrderMessages,
  useSendOrderMessage,
  useUpdateOrderStatus,
} from '@/lib/queries/useOrders';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';

interface OrderThreadProps {
  order: Order;
  onOrderUpdated?: (order: Order) => void;
}

export default function OrderThread({ order, onOrderUpdated }: OrderThreadProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { data: messages = [], refetch } = useOrderMessages(order.id);
  const sendMessage = useSendOrderMessage();
  const updateStatus = useUpdateOrderStatus();
  const [body, setBody] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const canUpdateStatus =
    user?.role === 'seller' || user?.role === 'admin' || order.buyerId === user?.id;

  const submitMessage = async () => {
    const text = body.trim();
    if (!text) return;
    try {
      await sendMessage.mutateAsync({ orderId: order.id, body: text });
      setBody('');
      refetch();
    } catch {
      // toast handled in hook optional
    }
  };

  const changeStatus = async (status: OrderStatus) => {
    try {
      const result = await updateStatus.mutateAsync({ orderId: order.id, status });
      onOrderUpdated?.(result.order);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-slate-50/80 p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-black/50">
            {order.businessName} · {order.createdAt}
          </p>
          <span className="text-[10px] font-mono font-black uppercase px-2 py-1 rounded-lg bg-flag-blue-50 text-flag-blue-700 border border-flag-blue-200">
            {order.status}
          </span>
        </div>
        <ul className="text-xs space-y-1 text-black/70">
          {order.items.map((item) => (
            <li key={item.productId}>
              {item.quantity}× {item.productName} — UGX {(item.price * item.quantity).toLocaleString()}
            </li>
          ))}
        </ul>
        <p className="text-sm font-mono font-black text-black">
          UGX {order.totalAmount.toLocaleString()}
        </p>
      </div>

      {canUpdateStatus && user?.role !== 'customer' && (
        <div className="flex flex-wrap gap-2">
          {(['confirmed', 'fulfilled', 'cancelled'] as OrderStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              disabled={order.status === status || updateStatus.isPending}
              onClick={() => changeStatus(status)}
              className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border border-black/10 hover:bg-black/5 disabled:opacity-40"
            >
              {status}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-black/10 bg-white p-3 max-h-64 overflow-y-auto space-y-3">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-flag-blue-600">
          {language === 'en' ? 'Nehna messages' : 'መልእኽቲ Nehna'}
        </p>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl px-3 py-2 text-sm ${
              msg.senderId === user?.id
                ? 'bg-flag-blue-50 border border-flag-blue-100 ml-4'
                : 'bg-black/5 border border-black/5 mr-4'
            }`}
          >
            <p className="text-[10px] font-mono font-bold text-black/45 mb-0.5">
              {msg.senderName} · {msg.senderRole}
            </p>
            <p className="text-black/80 leading-relaxed">{msg.body}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitMessage();
        }}
        className="flex gap-2"
      >
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            language === 'en' ? 'Message on Nehna...' : 'ኣብ Nehna መልእኽቲ...'
          }
          className="flex-1 px-3 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:border-flag-blue-400"
        />
        <button
          type="submit"
          disabled={sendMessage.isPending || !body.trim()}
          className="px-4 py-2.5 bg-flag-blue-600 hover:bg-flag-blue-500 text-white text-xs font-extrabold rounded-xl disabled:opacity-50"
        >
          {language === 'en' ? 'Send' : 'ሰዲድ'}
        </button>
      </form>
    </div>
  );
}
