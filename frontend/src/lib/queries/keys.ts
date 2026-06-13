import { api } from '@/lib/api';

export const qk = {
  me: ['me'] as const,
  businesses: (query?: Parameters<typeof api.listBusinesses>[0]) =>
    ['businesses', query ?? {}] as const,
  business: (id: string) => ['business', id] as const,
  products: (query?: Parameters<typeof api.listProducts>[0]) =>
    ['products', query ?? {}] as const,
  product: (id: string) => ['product', id] as const,
  inquiries: ['inquiries'] as const,
  myInquiries: ['inquiries', 'mine'] as const,
  favorites: ['favorites'] as const,
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
  orderMessages: (orderId: string) => ['orders', orderId, 'messages'] as const,
  users: (query?: Parameters<typeof api.listUsers>[0]) => ['users', query ?? {}] as const,
};
