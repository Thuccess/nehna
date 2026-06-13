'use client';

import { BadgeCheck, Clock, ShieldOff } from 'lucide-react';
import type { UserStatus } from '@adulis/shared';

interface StatusPillProps {
  status?: UserStatus;
  className?: string;
}

const config: Record<UserStatus, { label: string; cls: string; Icon: typeof BadgeCheck }> = {
  active: {
    label: 'Verified',
    cls: 'bg-flag-green-50 text-flag-green-700 border-flag-green-200',
    Icon: BadgeCheck,
  },
  pending: {
    label: 'Pending Approval',
    cls: 'bg-flag-gold-50 text-flag-gold-800 border-flag-gold-300',
    Icon: Clock,
  },
  banned: {
    label: 'Banned',
    cls: 'bg-rose-50 text-rose-700 border-rose-200',
    Icon: ShieldOff,
  },
};

export default function StatusPill({ status, className = '' }: StatusPillProps) {
  if (!status) return null;
  const { label, cls, Icon } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls} ${className}`}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </span>
  );
}
