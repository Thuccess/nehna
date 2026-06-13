import type { RequestHandler } from 'express';
import type { FavoriteInput } from '@adulis/shared';
import { favoriteService } from '../services/favorite.service.js';
import type { deleteParamsSchema } from '../validators/favorite.schema.js';
import type { z } from 'zod';

type DeleteParams = z.infer<typeof deleteParamsSchema>;

export const favoriteController = {
  list: (async (req, res) => {
    const favorites = await favoriteService.list(req.user!.sub);
    res.json({ favorites });
  }) as RequestHandler,

  add: (async (req, res) => {
    const input = req.body as FavoriteInput;
    const favorite = await favoriteService.add(req.user!.sub, input);
    res.status(201).json({ favorite });
  }) as RequestHandler,

  remove: (async (req, res) => {
    const { itemType, itemId } = req.params as unknown as DeleteParams;
    await favoriteService.remove(req.user!.sub, itemType, itemId);
    res.json({ ok: true });
  }) as RequestHandler,
};
