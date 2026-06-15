import { randomUUID } from 'node:crypto';
import {
  DEFAULT_BUSINESS_COVER,
  DEFAULT_BUSINESS_LOGO,
  type BusinessInput,
  type BusinessOnboardingInput,
  type BusinessUpdate,
} from '@adulis/shared';
import type { AuthTokenPayload } from '../types/auth.js';
import { HttpError } from '../middlewares/errorHandler.js';
import { toBusiness } from '../models/serialize.js';
import { businessRepository } from '../repositories/business.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import type { listQuerySchema } from '../validators/business.schema.js';
import type { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

function escapeRegex(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function toBusinessInput(
  input: BusinessOnboardingInput | BusinessInput,
  ownerName: string,
): BusinessInput {
  const onboarding = input as BusinessOnboardingInput;
  const description =
    onboarding.description?.trim() ||
    `${onboarding.name} on Nehna — connect with customers in Kampala.`;
  return {
    name: onboarding.name,
    ownerName,
    description,
    category: onboarding.category,
    address: onboarding.address?.trim() || onboarding.neighborhood,
    neighborhood: onboarding.neighborhood,
    phone: onboarding.phone,
    whatsAppNumber: onboarding.whatsAppNumber,
    logo: onboarding.logo || DEFAULT_BUSINESS_LOGO,
    coverImage: onboarding.coverImage || DEFAULT_BUSINESS_COVER,
    mapsUrl: 'mapsUrl' in input ? input.mapsUrl : undefined,
    features: 'features' in input ? input.features : undefined,
  };
}

export const businessService = {
  async list(q: ListQuery, user?: AuthTokenPayload) {
    const filter: Record<string, unknown> = {};

    if (q.status && q.status !== 'all') {
      filter.status = q.status;
    } else if (!user || user.role === 'customer') {
      filter.status = 'approved';
    }
    if (q.category) filter.category = q.category;
    if (q.neighborhood) filter.neighborhood = q.neighborhood;
    if (q.ownerId) filter.ownerId = q.ownerId;
    if (q.q) {
      const re = new RegExp(escapeRegex(q.q), 'i');
      filter.$or = [{ name: re }, { description: re }, { category: re }, { neighborhood: re }];
    }

    const docs = await businessRepository.findWithFilter(filter, q.limit);
    return docs.map(toBusiness);
  },

  async getById(id: string) {
    const doc = await businessRepository.findByIdLean(id);
    if (!doc) throw new HttpError(404, 'Business not found');
    return toBusiness(doc);
  },

  async create(ownerId: string, input: BusinessOnboardingInput | BusinessInput) {
    const owner = await userRepository.findById(ownerId);
    if (!owner) throw new HttpError(404, 'User not found');

    const existingIds = await businessRepository.findIdsByOwnerId(ownerId);
    if (existingIds.length > 0) {
      throw new HttpError(409, 'You already have a business profile');
    }

    const fullInput = toBusinessInput(input, owner.name);
    const id = `biz-${randomUUID()}`;
    const created = await businessRepository.create({
      _id: id,
      ownerId,
      ...fullInput,
      status: 'pending',
      package: 'basic',
      createdAt: new Date().toISOString().substring(0, 10),
    });

    if (owner.role === 'customer') {
      owner.role = 'seller';
      await owner.save();
    }

    return toBusiness(created.toObject());
  },

  async update(id: string, user: AuthTokenPayload, input: BusinessUpdate) {
    const doc = await businessRepository.findById(id);
    if (!doc) throw new HttpError(404, 'Business not found');
    const isOwner = doc.ownerId === user.sub;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new HttpError(403, 'Forbidden');

    const updated = await businessRepository.applyUpdate(doc, input, isAdmin);
    return toBusiness(updated!.toObject());
  },

  async delete(id: string) {
    const result = await businessRepository.deleteById(id);
    if (result.deletedCount === 0) throw new HttpError(404, 'Business not found');
  },

  async approve(id: string) {
    const doc = await businessRepository.updateStatus(id, 'approved');
    if (!doc) throw new HttpError(404, 'Business not found');
    return toBusiness(doc);
  },

  async suspend(id: string) {
    const doc = await businessRepository.updateStatus(id, 'suspended');
    if (!doc) throw new HttpError(404, 'Business not found');
    return toBusiness(doc);
  },
};
