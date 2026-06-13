import { Router } from 'express';
import { businessOnboardingInputSchema, businessUpdateSchema } from '@adulis/shared';
import { businessController } from '../controllers/business.controller.js';
import { optionalAuth, requireAuth, requireRole } from '../middlewares/auth.js';
import { requireActiveUser } from '../middlewares/requireActiveUser.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { listQuerySchema } from '../validators/business.schema.js';

const router = Router();

router.get(
  '/',
  optionalAuth,
  validate(listQuerySchema, 'query'),
  asyncHandler(businessController.list),
);

router.get('/:id', asyncHandler(businessController.getById));

router.post(
  '/',
  requireAuth,
  requireActiveUser,
  requireRole('customer', 'seller', 'admin'),
  validate(businessOnboardingInputSchema),
  asyncHandler(businessController.create),
);

router.patch(
  '/:id',
  requireAuth,
  requireActiveUser,
  validate(businessUpdateSchema),
  asyncHandler(businessController.update),
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(businessController.delete),
);

router.post(
  '/:id/approve',
  requireAuth,
  requireRole('admin'),
  asyncHandler(businessController.approve),
);

router.post(
  '/:id/suspend',
  requireAuth,
  requireRole('admin'),
  asyncHandler(businessController.suspend),
);

export default router;
