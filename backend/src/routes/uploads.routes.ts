import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { presignInputSchema } from '../validators/upload.schema.js';

const router = Router();

router.post(
  '/presign',
  requireAuth,
  validate(presignInputSchema),
  asyncHandler(uploadController.presign),
);

export default router;
