import { Router } from 'express';
import {
  communityPostInputSchema,
  newsArticleInputSchema,
  newsArticleUpdateSchema,
  reviewInputSchema,
} from '@adulis/shared';
import { connectController } from '../controllers/connect.controller.js';
import { reviewController } from '../controllers/review.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { requireActiveUser } from '../middlewares/requireActiveUser.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/news', asyncHandler(connectController.listNews));
router.get('/news/:id', asyncHandler(connectController.getNews));

router.post(
  '/news',
  requireAuth,
  requireRole('admin'),
  validate(newsArticleInputSchema),
  asyncHandler(connectController.createNews),
);

router.patch(
  '/news/:id',
  requireAuth,
  requireRole('admin'),
  validate(newsArticleUpdateSchema),
  asyncHandler(connectController.updateNews),
);

router.delete(
  '/news/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(connectController.deleteNews),
);

router.get('/posts', asyncHandler(connectController.listPosts));

router.post(
  '/posts',
  requireAuth,
  requireActiveUser,
  requireRole('seller', 'admin'),
  validate(communityPostInputSchema),
  asyncHandler(connectController.createPost),
);

router.delete(
  '/posts/:id',
  requireAuth,
  requireActiveUser,
  asyncHandler(connectController.deletePost),
);

export default router;
