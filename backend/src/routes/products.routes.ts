import { Router } from 'express';
import { productInputSchema, productUpdateSchema } from '@adulis/shared';
import { productController } from '../controllers/product.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { requireActiveUser } from '../middlewares/requireActiveUser.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { listQuerySchema } from '../validators/product.schema.js';

const router = Router();

router.get('/', validate(listQuerySchema, 'query'), asyncHandler(productController.list));

router.get('/:id', asyncHandler(productController.getById));

router.post(
  '/',
  requireAuth,
  requireActiveUser,
  requireRole('seller', 'admin'),
  validate(productInputSchema),
  asyncHandler(productController.create),
);

router.patch(
  '/:id',
  requireAuth,
  requireActiveUser,
  validate(productUpdateSchema),
  asyncHandler(productController.update),
);

router.delete('/:id', requireAuth, requireActiveUser, asyncHandler(productController.delete));

export default router;
