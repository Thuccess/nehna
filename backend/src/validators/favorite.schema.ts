import { favoriteItemTypeSchema } from '@adulis/shared';
import { z } from 'zod';

export const deleteParamsSchema = z.object({
  itemType: favoriteItemTypeSchema,
  itemId: z.string().min(1),
});
