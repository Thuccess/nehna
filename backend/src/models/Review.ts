import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const reviewSchema = new Schema(
  {
    _id: { type: String, required: true },
    businessId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { _id: false, timestamps: { createdAt: false, updatedAt: true } },
);

reviewSchema.index({ businessId: 1, userId: 1 }, { unique: true });

export type ReviewDoc = InferSchemaType<typeof reviewSchema> & { _id: string };

export const ReviewModel =
  (mongoose.models.Review as Model<ReviewDoc> | undefined) ??
  model<ReviewDoc>('Review', reviewSchema);
