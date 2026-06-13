import type { FavoriteInput } from '@adulis/shared';
import { FavoriteModel } from '../models/Favorite.js';

export const favoriteRepository = {
  async findByUserId(userId: string) {
    return FavoriteModel.find({ userId }).lean();
  },

  async upsert(userId: string, input: FavoriteInput) {
    return FavoriteModel.updateOne(
      { userId, itemType: input.itemType, itemId: input.itemId },
      { $setOnInsert: { userId, ...input } },
      { upsert: true },
    );
  },

  async deleteOne(userId: string, itemType: FavoriteInput['itemType'], itemId: string) {
    return FavoriteModel.deleteOne({ userId, itemType, itemId });
  },
};
