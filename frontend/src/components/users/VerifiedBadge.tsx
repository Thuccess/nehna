'use client';

import { BadgeCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  title?: string;
}

const sizeMap: Record<NonNullable<VerifiedBadgeProps['size']>, string> = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
};

export default function VerifiedBadge({
  size = 'sm',
  className = '',
  title = 'Verified by NehnaX admin',
}: VerifiedBadgeProps) {
  return (
    <span
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center text-flag-green-600 ${className}`}
    >
      <BadgeCheck className={`${sizeMap[size]} fill-flag-green-100 stroke-[2.5]`} strokeWidth={2.5} />
    </span>
  );
}
