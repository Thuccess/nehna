import { randomUUID } from 'node:crypto';
import type { ProductInput, ProductUpdate } from '@adulis/shared';
import type { AuthTokenPayload } from '../types/auth.js';
import { HttpError } from '../middlewares/errorHandler.js';
import { toProduct } from '../models/serialize.js';
import { businessRepository } from '../repositories/business.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import type { listQuerySchema } from '../validators/product.schema.js';
import type { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

function escapeRegex(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

async function assertCanModifyProductsFor(
  businessId: string,
  userId: string,
  role: string,
): Promise<void> {
  if (role === 'admin') return;
  const biz = await businessRepository.findByIdLean(businessId);
  if (!biz) throw new HttpError(404, 'Business not found');
  if (biz.ownerId !== userId) throw new HttpError(403, 'You do not own this business');
}

export const productService = {
  async list(q: ListQuery) {
    const filter: Record<string, unknown> = {};
    if (q.businessId) filter.businessId = q.businessId;
    if (q.category) filter.category = q.category;
    if (q.available !== undefined) filter.isAvailable = q.available;
    if (q.q) {
      const re = new RegExp(escapeRegex(q.q), 'i');
      filter.$or = [{ name: re }, { description: re }, { category: re }];
    }
    const docs = await productRepository.findWithFilter(filter, q.limit);
    return docs.map(toProduct);
  },

  async getById(id: string) {
    const doc = await productRepository.findByIdLean(id);
    if (!doc) throw new HttpError(404, 'Product not found');
    return toProduct(doc);
  },

  async create(user: AuthTokenPayload, input: ProductInput) {
    await assertCanModifyProductsFor(input.businessId, user.sub, user.role);
    const id = `prod-${randomUUID()}`;
    const created = await productRepository.create({
      _id: id,
      ...input,
      createdAt: new Date().toISOString().substring(0, 10),
    });
    return toProduct(created.toObject());
  },

  async update(id: string, user: AuthTokenPayload, input: ProductUpdate) {
    const doc = await productRepository.findById(id);
    if (!doc) throw new HttpError(404, 'Product not found');
    await assertCanModifyProductsFor(doc.businessId, user.sub, user.role);
    const updated = await productRepository.applyUpdate(doc, input);
    return toProduct(updated!.toObject());
  },

  async delete(id: string, user: AuthTokenPayload) {
    const doc = await productRepository.findById(id);
    if (!doc) throw new HttpError(404, 'Product not found');
    await assertCanModifyProductsFor(doc.businessId, user.sub, user.role);
    await productRepository.deleteDoc(doc);
  },
};
