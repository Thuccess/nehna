import { z } from 'zod';

export const listQuerySchema = z.object({
  businessId: z.string().optional(),
  category: z.string().optional(),
  q: z.string().optional(),
  available: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(60),
});
