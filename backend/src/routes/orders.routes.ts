import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { requireActiveUser } from '../middlewares/requireActiveUser.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import {
  orderInputSchema,
  orderMessageInputSchema,
  orderStatusUpdateSchema,
} from '../validators/order.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(orderController.list));
router.post(
  '/',
  requireActiveUser,
  requireRole('customer', 'admin'),
  validate(orderInputSchema),
  asyncHandler(orderController.create),
);
router.get('/:id', asyncHandler(orderController.get));
router.patch('/:id/status', validate(orderStatusUpdateSchema), asyncHandler(orderController.updateStatus));
router.get('/:id/messages', asyncHandler(orderController.listMessages));
router.post('/:id/messages', validate(orderMessageInputSchema), asyncHandler(orderController.addMessage));

export default router;
