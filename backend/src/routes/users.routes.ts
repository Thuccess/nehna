import { Router } from 'express';
import { updateUserInputSchema } from '@adulis/shared';
import { userController } from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { listQuerySchema } from '../validators/user.schema.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  requireRole('admin'),
  validate(listQuerySchema, 'query'),
  asyncHandler(userController.list),
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  validate(updateUserInputSchema),
  asyncHandler(userController.update),
);

router.post(
  '/:id/approve',
  requireAuth,
  requireRole('admin'),
  asyncHandler(userController.approve),
);

export default router;
