import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatUgx(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG')}`;
}
