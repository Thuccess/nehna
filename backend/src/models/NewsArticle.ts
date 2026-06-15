import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const newsArticleSchema = new Schema(
  {
    _id: { type: String, required: true },
    section: { type: String, enum: ['eri_news', 'uga_news'], required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    imageUrl: { type: String },
    authorId: { type: String, required: true },
    publishedAt: { type: String, required: true, index: true },
    createdAt: { type: String, required: true },
  },
  { _id: false, timestamps: { createdAt: false, updatedAt: true } },
);

export type NewsArticleDoc = InferSchemaType<typeof newsArticleSchema> & { _id: string };

export const NewsArticleModel =
  (mongoose.models.NewsArticle as Model<NewsArticleDoc> | undefined) ??
  model<NewsArticleDoc>('NewsArticle', newsArticleSchema);
