'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import MobileMoreSheet from './MobileMoreSheet';
import CartSheet from '@/components/cart/CartSheet';
import PendingBanner from './PendingBanner';
import { MobileMoreProvider } from '@/providers/MobileMoreProvider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileMoreProvider>
      <div className="min-h-dvh flex flex-col bg-white text-black selection:bg-flag-blue-500/25 selection:text-flag-blue-700">
        <Navbar />
        <PendingBanner />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <MobileBottomNav />
        <MobileMoreSheet />
        <CartSheet />
      </div>
    </MobileMoreProvider>
  );
}
