import Image from 'next/image';
import Link from 'next/link';

const LOGO_WIDTH = 240;
const LOGO_HEIGHT = 80;

interface NehnaXLogoProps {
  className?: string;
  priority?: boolean;
  linkToHome?: boolean;
}

export default function NehnaXLogo({
  className = '',
  priority = false,
  linkToHome = false,
}: NehnaXLogoProps) {
  const image = (
    <Image
      src="/nehnax-logo.png"
      alt="NehnaX — Buy. Sell. Connect."
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={`h-9 sm:h-10 md:h-11 w-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] object-contain object-left ${className}`}
    />
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-flex shrink-0 items-center min-w-0" aria-label="NehnaX home">
        {image}
      </Link>
    );
  }

  return image;
}
