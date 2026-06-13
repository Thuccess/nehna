import { z } from 'zod';

export {
  forgotPasswordInputSchema,
  loginInputSchema,
  registerInputSchema,
  resetPasswordInputSchema,
  sellerRegisterInputSchema,
} from '@adulis/shared';

export const updateMeInputSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  avatarUrl: z.string().url().optional(),
});
