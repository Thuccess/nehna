import type { ProductInput, ProductUpdate } from '@adulis/shared';
import type { HydratedDocument } from 'mongoose';
import { ProductModel, type ProductDoc } from '../models/Product.js';

type ProductDocument = HydratedDocument<ProductDoc>;

export const PRODUCT_SEARCH_INDEX = 'products_search';

export const productRepository = {
  async findWithFilter(filter: Record<string, unknown>, limit: number) {
    return ProductModel.find(filter).limit(limit).sort({ createdAt: -1 }).lean();
  },

  async findByIdLean(id: string) {
    return ProductModel.findById(id).lean();
  },

  async findById(id: string) {
    return ProductModel.findById(id);
  },

  async create(data: ProductInput & { _id: string; createdAt: string }) {
    return ProductModel.create(data);
  },

  async applyUpdate(doc: ProductDocument | null, input: ProductUpdate) {
    if (!doc) return null;
    for (const [k, v] of Object.entries(input)) {
      if (v === undefined) continue;
      (doc as unknown as Record<string, unknown>)[k] = v;
    }
    await doc.save();
    return doc;
  },

  async deleteDoc(doc: ProductDocument) {
    await doc.deleteOne();
  },

  async searchAggregate(q: string, limit: number) {
    return ProductModel.aggregate([
      {
        $search: {
          index: PRODUCT_SEARCH_INDEX,
          text: {
            query: q,
            path: ['name', 'description', 'category'],
            fuzzy: { maxEdits: 1 },
          },
        },
      },
      { $limit: limit },
    ]);
  },

  async searchFallback(re: RegExp, limit: number) {
    return ProductModel.find({
      $or: [{ name: re }, { description: re }, { category: re }],
    })
      .limit(limit)
      .lean();
  },
};
