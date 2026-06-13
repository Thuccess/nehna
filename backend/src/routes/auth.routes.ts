import { Router } from 'express';
import { businessOnboardingInputSchema, businessUpdateSchema } from '@adulis/shared';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { rateLimit } from '../middlewares/rateLimit.js';
import { validate } from '../middlewares/validate.js';
import {
  forgotPasswordInputSchema,
  loginInputSchema,
  registerInputSchema,
  resetPasswordInputSchema,
  sellerRegisterInputSchema,
} from '../validators/auth.schema.js';
import { updateMeInputSchema } from '../validators/auth.schema.js';

const router = Router();
const authRateLimit = rateLimit();

router.post(
  '/register',
  authRateLimit,
  validate(registerInputSchema),
  asyncHandler(authController.register),
);

router.post(
  '/register/seller',
  authRateLimit,
  validate(sellerRegisterInputSchema),
  asyncHandler(authController.registerSeller),
);

router.post(
  '/login',
  authRateLimit,
  validate(loginInputSchema),
  asyncHandler(authController.login),
);

router.post('/logout', asyncHandler(authController.logout));

router.post(
  '/forgot-password',
  authRateLimit,
  validate(forgotPasswordInputSchema),
  asyncHandler(authController.forgotPassword),
);

router.post(
  '/reset-password',
  authRateLimit,
  validate(resetPasswordInputSchema),
  asyncHandler(authController.resetPassword),
);

router.get('/me', requireAuth, asyncHandler(authController.me));

router.patch(
  '/me',
  requireAuth,
  validate(updateMeInputSchema),
  asyncHandler(authController.updateMe),
);

export default router;
