'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

interface BreadcrumbProps {
  segments: { label: string; href?: string }[];
}

export default function Breadcrumb({ segments }: BreadcrumbProps) {
  const { t } = useLanguage();
  return (
    <div
      className="flex items-center gap-1.5 text-xs text-black/50 mb-6 font-mono overflow-x-auto scrollbar-none max-w-full"
      id="breadcrumbs"
    >
      <Link href="/" className="hover:underline cursor-pointer hover:text-black shrink-0">
        {t.navHome}
      </Link>
      {segments.map((s, i) => (
        <span key={`${s.label}-${i}`} className="flex items-center gap-1.5 shrink-0">
          <ChevronRight className="h-3 w-3 shrink-0" />
          {s.href ? (
            <Link
              href={s.href}
              className="hover:underline cursor-pointer hover:text-black truncate max-w-[120px] sm:max-w-none"
            >
              {s.label}
            </Link>
          ) : (
            <span className="text-sky-500 font-semibold uppercase truncate max-w-[140px] sm:max-w-none">
              {s.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
