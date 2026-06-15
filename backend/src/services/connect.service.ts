import type {
  CommunityPost,
  NewsArticle,
  NewsArticleInput,
  NewsArticleUpdate,
  CommunityPostInput,
} from '@adulis/shared';
import { randomUUID } from 'node:crypto';
import { CommunityPostModel, type CommunityPostDoc } from '../models/CommunityPost.js';
import { NewsArticleModel, type NewsArticleDoc } from '../models/NewsArticle.js';
import { BusinessModel } from '../models/Business.js';
import { HttpError } from '../middlewares/errorHandler.js';
import { businessRepository } from '../repositories/business.repository.js';

function toNewsArticle(doc: NewsArticleDoc): NewsArticle {
  return {
    id: doc._id,
    section: doc.section as NewsArticle['section'],
    title: doc.title,
    body: doc.body,
    imageUrl: doc.imageUrl ?? undefined,
    authorId: doc.authorId,
    publishedAt: doc.publishedAt,
    createdAt: doc.createdAt,
  };
}

function toCommunityPost(
  doc: CommunityPostDoc,
  business?: { name: string; logo: string },
): CommunityPost {
  return {
    id: doc._id,
    businessId: doc.businessId,
    authorId: doc.authorId,
    title: doc.title ?? undefined,
    body: doc.body,
    productId: doc.productId ?? undefined,
    imageUrl: doc.imageUrl ?? undefined,
    createdAt: doc.createdAt,
    businessName: business?.name,
    businessLogo: business?.logo,
  };
}

export const connectService = {
  async listNews(section?: string): Promise<NewsArticle[]> {
    const filter = section ? { section } : {};
    const docs = await NewsArticleModel.find(filter).sort({ publishedAt: -1 }).limit(50);
    return docs.map((d) => toNewsArticle(d.toObject() as NewsArticleDoc));
  },

  async getNews(id: string): Promise<NewsArticle> {
    const doc = await NewsArticleModel.findById(id);
    if (!doc) throw new HttpError(404, 'Article not found');
    return toNewsArticle(doc.toObject() as NewsArticleDoc);
  },

  async createNews(authorId: string, input: NewsArticleInput): Promise<NewsArticle> {
    const now = new Date().toISOString();
    const doc = await NewsArticleModel.create({
      _id: randomUUID(),
      section: input.section,
      title: input.title,
      body: input.body,
      imageUrl: input.imageUrl,
      authorId,
      publishedAt: input.publishedAt ?? now,
      createdAt: now,
    });
    return toNewsArticle(doc.toObject() as NewsArticleDoc);
  },

  async updateNews(id: string, input: NewsArticleUpdate): Promise<NewsArticle> {
    const doc = await NewsArticleModel.findById(id);
    if (!doc) throw new HttpError(404, 'Article not found');
    if (input.section) doc.section = input.section;
    if (input.title) doc.title = input.title;
    if (input.body) doc.body = input.body;
    if (input.imageUrl !== undefined) doc.imageUrl = input.imageUrl;
    if (input.publishedAt) doc.publishedAt = input.publishedAt;
    await doc.save();
    return toNewsArticle(doc.toObject() as NewsArticleDoc);
  },

  async deleteNews(id: string): Promise<void> {
    const result = await NewsArticleModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) throw new HttpError(404, 'Article not found');
  },

  async listPosts(): Promise<CommunityPost[]> {
    const docs = await CommunityPostModel.find().sort({ createdAt: -1 }).limit(100);
    const businessIds = [...new Set(docs.map((d) => d.businessId))];
    const businesses = await BusinessModel.find({ _id: { $in: businessIds } });
    const bizMap = new Map(businesses.map((b) => [b._id, { name: b.name, logo: b.logo }]));

    return docs.map((d) => {
      const biz = bizMap.get(d.businessId);
      return toCommunityPost(d.toObject() as CommunityPostDoc, biz);
    });
  },

  async createPost(authorId: string, input: CommunityPostInput): Promise<CommunityPost> {
    const biz = await businessRepository.findById(input.businessId);
    if (!biz) throw new HttpError(404, 'Business not found');
    if (biz.ownerId !== authorId) throw new HttpError(403, 'Forbidden');

    const now = new Date().toISOString();
    const doc = await CommunityPostModel.create({
      _id: randomUUID(),
      businessId: input.businessId,
      authorId,
      title: input.title,
      body: input.body,
      productId: input.productId,
      imageUrl: input.imageUrl,
      createdAt: now,
    });
    return toCommunityPost(doc.toObject() as CommunityPostDoc, {
      name: biz.name,
      logo: biz.logo,
    });
  },

  async deletePost(id: string, userId: string, role: string): Promise<void> {
    const doc = await CommunityPostModel.findById(id);
    if (!doc) throw new HttpError(404, 'Post not found');
    if (role !== 'admin' && doc.authorId !== userId) throw new HttpError(403, 'Forbidden');
    await doc.deleteOne();
  },
};
