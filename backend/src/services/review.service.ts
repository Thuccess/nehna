import type { Review } from '@adulis/shared';
import { randomUUID } from 'node:crypto';
import { ReviewModel, type ReviewDoc } from '../models/Review.js';

function toReview(doc: ReviewDoc): Review {
  return {
    id: doc._id,
    businessId: doc.businessId,
    userId: doc.userId,
    userName: doc.userName,
    rating: doc.rating,
    comment: doc.comment,
    createdAt: doc.createdAt,
  };
}

export const reviewService = {
  async listForBusiness(businessId: string): Promise<Review[]> {
    const docs = await ReviewModel.find({ businessId }).sort({ createdAt: -1 }).limit(100);
    return docs.map((d) => toReview(d.toObject() as ReviewDoc));
  },

  async create(
    businessId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string,
  ): Promise<Review> {
    const existing = await ReviewModel.findOne({ businessId, userId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return toReview(existing.toObject() as ReviewDoc);
    }

    const now = new Date().toISOString();
    const doc = await ReviewModel.create({
      _id: randomUUID(),
      businessId,
      userId,
      userName,
      rating,
      comment,
      createdAt: now,
    });
    return toReview(doc.toObject() as ReviewDoc);
  },

  async getAverageRating(businessId: string): Promise<{ average: number; count: number }> {
    const docs = await ReviewModel.find({ businessId });
    if (docs.length === 0) return { average: 0, count: 0 };
    const sum = docs.reduce((acc, d) => acc + d.rating, 0);
    return { average: sum / docs.length, count: docs.length };
  },
};
