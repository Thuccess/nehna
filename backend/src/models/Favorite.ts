import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const favoriteSchema = new Schema(
  {
    userId: { type: String, required: true, index: true, ref: 'User' },
    itemType: { type: String, enum: ['product', 'business'], required: true },
    itemId: { type: String, required: true },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

export type FavoriteDoc = InferSchemaType<typeof favoriteSchema>;

export const FavoriteModel =
  (mongoose.models.Favorite as Model<FavoriteDoc> | undefined) ??
  model<FavoriteDoc>('Favorite', favoriteSchema);
