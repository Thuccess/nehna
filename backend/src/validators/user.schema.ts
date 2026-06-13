import { z } from 'zod';

export const listQuerySchema = z.object({
  role: z.enum(['customer', 'seller', 'admin']).optional(),
  status: z.enum(['pending', 'active', 'banned']).optional(),
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});
