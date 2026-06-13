import type { RequestHandler } from 'express';
import { HttpError } from './errorHandler.js';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs?: number;
  max?: number;
}

export function rateLimit({ windowMs = 60_000, max = 20 }: RateLimitOptions = {}): RequestHandler {
  return (req, _res, next) => {
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now >= entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (entry.count >= max) {
      next(new HttpError(429, 'Too many requests'));
      return;
    }

    entry.count += 1;
    next();
  };
}
