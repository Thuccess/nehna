import { z } from 'zod';

export const listQuerySchema = z.object({
  category: z.string().optional(),
  neighborhood: z.string().optional(),
  status: z.enum(['pending', 'approved', 'suspended', 'all']).optional(),
  ownerId: z.string().optional(),
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
