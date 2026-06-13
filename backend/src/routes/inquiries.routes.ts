import { Router } from 'express';
import { inquiryController } from '../controllers/inquiry.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { inquiryInputSchema } from '../validators/inquiry.schema.js';

const router = Router();

router.get('/', requireAuth, asyncHandler(inquiryController.list));

router.post('/', validate(inquiryInputSchema), asyncHandler(inquiryController.create));

router.patch('/:id/read', requireAuth, asyncHandler(inquiryController.markRead));

export default router;
