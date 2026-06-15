import Image from 'next/image';
import Link from 'next/link';

const LOGO_WIDTH = 320;
const LOGO_HEIGHT = 120;

interface NehnaXLogoProps {
  className?: string;
  priority?: boolean;
  linkToHome?: boolean;
  variant?: 'default' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<NehnaXLogoProps['size']>, string> = {
  sm: 'h-9 max-w-[130px] sm:max-w-[150px]',
  md: 'h-10 sm:h-11 max-w-[150px] sm:max-w-[190px]',
  lg: 'h-12 sm:h-14 max-w-[190px] sm:max-w-[240px]',
};

export default function NehnaXLogo({
  className = '',
  priority = false,
  linkToHome = false,
  variant = 'default',
  size = 'md',
}: NehnaXLogoProps) {
  const image = (
    <Image
      src="/nehna-logo.png"
      alt="Nehna — Buy. Sell. Connect."
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={`w-auto object-contain object-left ${sizeClasses[size]} ${className}`}
    />
  );

  const mark =
    variant === 'light' ? (
      <span className="inline-flex rounded-xl bg-white p-2 shadow-md shadow-black/15">
        {image}
      </span>
    ) : (
      image
    );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-flex shrink-0 items-center min-w-0" aria-label="Nehna home">
        {mark}
      </Link>
    );
  }

  return mark;
}
