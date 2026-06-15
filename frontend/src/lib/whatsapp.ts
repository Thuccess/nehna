/** Build a WhatsApp chat URL from a phone number (digits only). */
export function formatWhatsAppUrl(number: string, message?: string): string {
  const digits = number.replace(/\D/g, '');
  if (!digits) return '#';
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function formatTelUrl(number: string): string {
  const cleaned = number.replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}
