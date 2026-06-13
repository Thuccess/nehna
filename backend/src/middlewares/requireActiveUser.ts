import type { RequestHandler } from 'express';
import { userRepository } from '../repositories/user.repository.js';
import { HttpError } from './errorHandler.js';

export const requireActiveUser: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.user) return next(new HttpError(401, 'Authentication required'));
    const doc = await userRepository.findByIdLean(req.user.sub);
    if (!doc) return next(new HttpError(401, 'User not found'));
    if (doc.status === 'banned') return next(new HttpError(403, 'Account is banned'));
    if (doc.status === 'pending') {
      return next(
        new HttpError(403, 'Account is awaiting admin approval. You cannot perform this action yet.'),
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};
