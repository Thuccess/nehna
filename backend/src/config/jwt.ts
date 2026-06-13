import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from './env.js';
import type { AuthTokenPayload } from '../types/auth.js';

export function signToken(payload: AuthTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
