import type { CookieOptions, Response } from 'express';
import { env } from '../config/env.js';

export const AUTH_COOKIE_NAME = 'adulis_token';

export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SECURE ? 'none' : 'lax',
    path: '/',
    domain: env.COOKIE_DOMAIN || undefined,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, { ...authCookieOptions(), maxAge: 0 });
}
