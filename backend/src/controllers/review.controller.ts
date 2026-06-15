import type { RequestHandler } from 'express';
import type { ReviewInput } from '@adulis/shared';
import { reviewService } from '../services/review.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { HttpError } from '../middlewares/errorHandler.js';

export const reviewController = {
  list: (async (req, res) => {
    const reviews = await reviewService.listForBusiness(req.params.id);
    const stats = await reviewService.getAverageRating(req.params.id);
    res.json({ reviews, stats });
  }) as RequestHandler,

  create: (async (req, res) => {
    const userId = req.user!.sub;
    const user = await userRepository.findById(userId);
    if (!user) throw new HttpError(401, 'User not found');

    const input = req.body as ReviewInput;
    const review = await reviewService.create(
      req.params.id,
      userId,
      user.name,
      input.rating,
      input.comment,
    );
    res.status(201).json({ review });
  }) as RequestHandler,
};
