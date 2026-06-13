'use client';

import { useLanguage } from '@/providers/LanguageProvider';

const WORD_COLORS = ['text-flag-red-600', 'text-flag-green-600', 'text-flag-blue-600'] as const;

interface BrandTaglineProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showUnderline?: boolean;
}

export default function BrandTagline({
  className = '',
  size = 'md',
  showUnderline = true,
}: BrandTaglineProps) {
  const { t } = useLanguage();

  const sizeClass = {
    sm: 'text-xs font-extrabold tracking-wide',
    md: 'text-sm font-extrabold tracking-wide',
    lg: 'text-base md:text-lg font-black tracking-tight',
  }[size];

  const delimiter = t.tagline.includes('።') ? '።' : '.';
  const parts = t.tagline
    .split(delimiter)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <p
      className={`font-sans italic ${sizeClass} ${className}`}
      aria-label={t.tagline}
    >
      {parts.map((part, index) => (
        <span key={index} className="inline-flex items-baseline">
          <span
            className={`relative ${WORD_COLORS[index % WORD_COLORS.length]} ${
              showUnderline && index < 2
                ? 'after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-flag-gold-500/70 after:content-[""]'
                : ''
            }`}
          >
            {part}
          </span>
          {index < parts.length - 1 && (
            <span className="text-black/25 mx-1.5 not-italic font-mono text-[0.85em]">
              {delimiter}
            </span>
          )}
        </span>
      ))}
    </p>
  );
}
