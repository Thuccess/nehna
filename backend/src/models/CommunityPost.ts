import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const communityPostSchema = new Schema(
  {
    _id: { type: String, required: true },
    businessId: { type: String, required: true, index: true },
    authorId: { type: String, required: true, index: true },
    title: { type: String },
    body: { type: String, required: true },
    productId: { type: String },
    imageUrl: { type: String },
    createdAt: { type: String, required: true, index: true },
  },
  { _id: false, timestamps: { createdAt: false, updatedAt: true } },
);

export type CommunityPostDoc = InferSchemaType<typeof communityPostSchema> & { _id: string };

export const CommunityPostModel =
  (mongoose.models.CommunityPost as Model<CommunityPostDoc> | undefined) ??
  model<CommunityPostDoc>('CommunityPost', communityPostSchema);
