import { Router } from 'express';
import { favoriteInputSchema } from '@adulis/shared';
import { favoriteController } from '../controllers/favorite.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { requireActiveUser } from '../middlewares/requireActiveUser.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { deleteParamsSchema } from '../validators/favorite.schema.js';

const router = Router();

router.get('/', requireAuth, asyncHandler(favoriteController.list));

router.post(
  '/',
  requireAuth,
  requireActiveUser,
  validate(favoriteInputSchema),
  asyncHandler(favoriteController.add),
);

router.delete(
  '/:itemType/:itemId',
  requireAuth,
  requireActiveUser,
  validate(deleteParamsSchema, 'params'),
  asyncHandler(favoriteController.remove),
);

export default router;
