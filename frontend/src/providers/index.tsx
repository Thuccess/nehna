'use client';

import { AuthProvider } from './AuthProvider';
import { LanguageProvider } from './LanguageProvider';
import { QueryProvider } from './QueryProvider';
import { ToastProvider } from '@/lib/toast';
import { CartProvider } from './CartProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>{children}</ToastProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}

export { AuthProvider, useAuth } from './AuthProvider';
export { CartProvider, useCart } from './CartProvider';
export { LanguageProvider, useLanguage, useT } from './LanguageProvider';
export { QueryProvider } from './QueryProvider';
