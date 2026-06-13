import type { RequestHandler } from 'express';
import type { UserRole } from '@adulis/shared';
import { verifyToken } from '../config/jwt.js';
import { HttpError } from './errorHandler.js';

function extractToken(req: Parameters<RequestHandler>[0]): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim();
  }
  const cookieToken = (req as unknown as { cookies?: Record<string, string> }).cookies?.adulis_token;
  return cookieToken ?? null;
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (!token) throw new HttpError(401, 'Authentication required');
    req.user = verifyToken(token);
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
};

export const optionalAuth: RequestHandler = (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (token) req.user = verifyToken(token);
  } catch {
    // ignore: optional
  }
  next();
};

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, 'Authentication required'));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, 'Insufficient role'));
    next();
  };
}
