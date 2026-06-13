import type { FavoriteInput } from '@adulis/shared';
import { favoriteRepository } from '../repositories/favorite.repository.js';

export const favoriteService = {
  async list(userId: string) {
    const docs = await favoriteRepository.findByUserId(userId);
    return docs.map((d) => ({
      userId: d.userId,
      itemType: d.itemType,
      itemId: d.itemId,
    }));
  },

  async add(userId: string, input: FavoriteInput) {
    await favoriteRepository.upsert(userId, input);
    return { userId, ...input };
  },

  async remove(userId: string, itemType: FavoriteInput['itemType'], itemId: string) {
    await favoriteRepository.deleteOne(userId, itemType, itemId);
  },
};
