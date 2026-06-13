import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const variants = {
  primary:
    'bg-flag-red-600 hover:bg-flag-red-500 text-white shadow-sm shadow-flag-red-600/20 border border-transparent',
  secondary:
    'bg-flag-blue-600 hover:bg-flag-blue-500 text-white shadow-sm shadow-flag-blue-600/15 border border-transparent',
  outline:
    'border border-black/12 bg-white hover:bg-black/5 text-black hover:border-black/20',
  ghost: 'border border-transparent hover:bg-black/5 text-black/75 hover:text-black',
  success:
    'bg-flag-green-600 hover:bg-flag-green-500 text-white shadow-sm border border-transparent',
  sky: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm border border-transparent',
  nav: 'border border-transparent text-black/70 hover:text-black hover:bg-black/5',
  'nav-active': 'bg-sky-500/10 text-sky-600 border border-sky-500/25 font-bold',
} as const;

const sizes = {
  xs: 'text-[11px] px-2.5 py-1.5 min-h-8 gap-1 rounded-lg',
  sm: 'text-xs px-3 py-2 min-h-9 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 min-h-11 gap-2 rounded-xl',
  lg: 'text-sm px-5 py-3 min-h-11 gap-2 rounded-xl',
  icon: 'p-2.5 min-h-11 min-w-11 rounded-xl gap-0',
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
  className?: string;
};

const iconSize: Record<Size, string> = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-4 w-4',
  icon: 'h-5 w-5',
};

function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: Pick<ButtonBaseProps, 'variant' | 'size' | 'className'>) {
  return cn(
    'inline-flex items-center justify-center font-semibold transition touch-manipulation',
    'active:scale-[0.98] disabled:opacity-55 disabled:pointer-events-none disabled:active:scale-100',
    variants[variant],
    sizes[size],
    className,
  );
}

function ButtonIcon({
  Icon,
  size,
  position,
}: {
  Icon: IconComponent;
  size: Size;
  position: 'left' | 'right';
}) {
  return (
    <Icon
      className={cn(iconSize[size], 'shrink-0', position === 'right' && 'order-2')}
      strokeWidth={2.25}
    />
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  children,
  type = 'button',
  ...props
}: ButtonBaseProps & ComponentProps<'button'>) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      {Icon && iconPosition === 'left' && <ButtonIcon Icon={Icon} size={size} position="left" />}
      {children != null && children !== '' && (
        <span className="truncate leading-tight">{children}</span>
      )}
      {Icon && iconPosition === 'right' && <ButtonIcon Icon={Icon} size={size} position="right" />}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  children,
  ...props
}: ButtonBaseProps & { href: string } & Omit<ComponentProps<typeof Link>, 'href'>) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...props}>
      {Icon && iconPosition === 'left' && <ButtonIcon Icon={Icon} size={size} position="left" />}
      {children != null && children !== '' && (
        <span className="truncate leading-tight">{children}</span>
      )}
      {Icon && iconPosition === 'right' && <ButtonIcon Icon={Icon} size={size} position="right" />}
    </Link>
  );
}
