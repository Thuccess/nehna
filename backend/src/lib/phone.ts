/** Normalize phone to +digits for consistent storage and lookup. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return phone.trim();
  return `+${digits}`;
}

export function isEmailIdentifier(value: string): boolean {
  return value.includes('@');
}
