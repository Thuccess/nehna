import type { User, UserStatus } from '@adulis/shared';

export function isVerified(user: Pick<User, 'status'> | null | undefined): boolean {
  return user?.status === 'active';
}

export function isPending(user: Pick<User, 'status'> | null | undefined): boolean {
  return user?.status === 'pending';
}

export function isBanned(user: Pick<User, 'status'> | null | undefined): boolean {
  return user?.status === 'banned';
}

export function splitName(fullName: string): { first: string; last: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { first: '', last: '' };
  const idx = trimmed.lastIndexOf(' ');
  if (idx === -1) return { first: trimmed, last: '' };
  return {
    first: trimmed.slice(0, idx),
    last: trimmed.slice(idx + 1),
  };
}

export function statusLabel(status: UserStatus | undefined, language: 'en' | 'ti' = 'en'): string {
  const dict: Record<UserStatus, { en: string; ti: string }> = {
    active: { en: 'Verified', ti: 'ተረጋጊጹ' },
    pending: { en: 'Pending Approval', ti: 'ምጽዳቕ ይጽበ' },
    banned: { en: 'Banned', ti: 'ተኣጊዱ' },
  };
  return status ? dict[status][language] : '';
}
