import type { BusinessInput, BusinessUpdate } from '@adulis/shared';
import type { HydratedDocument } from 'mongoose';
import { BusinessModel, type BusinessDoc } from '../models/Business.js';

type BusinessDocument = HydratedDocument<BusinessDoc>;

export const BUSINESS_SEARCH_INDEX = 'businesses_search';

export const businessRepository = {
  async findWithFilter(filter: Record<string, unknown>, limit: number) {
    return BusinessModel.find(filter).limit(limit).sort({ createdAt: -1 }).lean();
  },

  async findByIdLean(id: string) {
    return BusinessModel.findById(id).lean();
  },

  async findById(id: string) {
    return BusinessModel.findById(id);
  },

  async create(data: BusinessInput & { _id: string; ownerId: string; status: BusinessDoc['status']; package: BusinessDoc['package']; createdAt: string }) {
    return BusinessModel.create(data);
  },

  async deleteById(id: string) {
    return BusinessModel.deleteOne({ _id: id });
  },

  async updateStatus(id: string, status: BusinessDoc['status']) {
    return BusinessModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  },

  async findIdsByOwnerId(ownerId: string) {
    return BusinessModel.find({ ownerId }).select('_id').lean();
  },

  async applyUpdate(doc: BusinessDocument | null, input: BusinessUpdate, isAdmin: boolean) {
    if (!doc) return null;
    const adminOnly = new Set(['status', 'package']);
    for (const [k, v] of Object.entries(input)) {
      if (v === undefined) continue;
      if (adminOnly.has(k) && !isAdmin) continue;
      (doc as unknown as Record<string, unknown>)[k] = v;
    }
    await doc.save();
    return doc;
  },

  async searchAggregate(q: string, limit: number) {
    return BusinessModel.aggregate([
      {
        $search: {
          index: BUSINESS_SEARCH_INDEX,
          text: {
            query: q,
            path: ['name', 'description', 'category', 'neighborhood', 'address'],
            fuzzy: { maxEdits: 1 },
          },
        },
      },
      { $match: { status: 'approved' } },
      { $limit: limit },
    ]);
  },

  async searchFallback(re: RegExp, limit: number) {
    return BusinessModel.find({
      status: 'approved',
      $or: [{ name: re }, { description: re }, { category: re }, { neighborhood: re }, { address: re }],
    })
      .limit(limit)
      .lean();
  },
};
