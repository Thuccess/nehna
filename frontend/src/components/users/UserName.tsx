'use client';

import type { User, UserStatus } from '@adulis/shared';
import { isVerified, splitName } from '@/lib/userStatus';
import VerifiedBadge from './VerifiedBadge';

interface UserNameProps {
  user?: Pick<User, 'name' | 'status'> | null;
  name?: string;
  status?: UserStatus;
  badgeSize?: 'xs' | 'sm' | 'md';
  className?: string;
  showFirstName?: boolean;
}

export default function UserName({
  user,
  name,
  status,
  badgeSize = 'sm',
  className = '',
  showFirstName = true,
}: UserNameProps) {
  const fullName = user?.name ?? name ?? '';
  const effectiveStatus = user?.status ?? status;
  const verified = isVerified({ status: effectiveStatus });

  const { first, last } = splitName(fullName);
  if (!fullName) return null;

  return (
    <span className={`inline-flex items-baseline gap-1 ${className}`}>
      {showFirstName && first && <span>{first}</span>}
      {last ? (
        <span className="inline-flex items-center gap-1">
          {showFirstName ? <span>{last}</span> : <span>{first}</span>}
          {verified && <VerifiedBadge size={badgeSize} />}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          <span>{first}</span>
          {verified && <VerifiedBadge size={badgeSize} />}
        </span>
      )}
    </span>
  );
}
