'use client';

import { MessageCircle } from 'lucide-react';
import { formatWhatsAppUrl } from '@/lib/whatsapp';

const SUPPORT_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP?.replace(/\D/g, '') ?? '';

export default function WhatsAppSupportButton() {
  if (!SUPPORT_NUMBER) return null;

  const href = formatWhatsAppUrl(
    SUPPORT_NUMBER,
    'Hello Nehna support — I need help with the marketplace.',
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp support"
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] transition-transform hover:scale-105 touch-manipulation bottom-[calc(4.5rem+var(--safe-bottom))] right-4 md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2} />
    </a>
  );
}
