import type { User } from '@adulis/shared';

export function getSellHref(user: User | null | undefined): string {
  if (user?.role === 'seller' || user?.role === 'admin') {
    return '/seller/businesses';
  }
  return '/register/seller';
}

export const TAGLINE_LINKS = [
  { href: '/products', key: 'buy' },
  { href: null as string | null, key: 'sell' }, // resolved via getSellHref
  { href: '/connect', key: 'connect' },
] as const;
