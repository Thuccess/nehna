import { randomUUID } from 'node:crypto';
import type { InquiryInput } from '@adulis/shared';
import type { AuthTokenPayload } from '../types/auth.js';
import { HttpError } from '../middlewares/errorHandler.js';
import { toInquiry } from '../models/serialize.js';
import { businessRepository } from '../repositories/business.repository.js';
import { inquiryRepository } from '../repositories/inquiry.repository.js';
import { userRepository } from '../repositories/user.repository.js';

export const inquiryService = {
  async list(user: AuthTokenPayload, opts: { mine?: boolean } = {}) {
    const filter: Record<string, unknown> = {};
    if (opts.mine || (user.role !== 'seller' && user.role !== 'admin')) {
      const me = await userRepository.findByIdLean(user.sub);
      if (!me) throw new HttpError(404, 'User not found');
      filter.buyerPhone = me.phone;
    } else if (user.role === 'seller') {
      const biz = await businessRepository.findIdsByOwnerId(user.sub);
      filter.businessId = { $in: biz.map((b) => b._id) };
    }
    const docs = await inquiryRepository.findWithFilter(filter);
    return docs.map(toInquiry);
  },

  async create(input: InquiryInput) {
    const biz = await businessRepository.findByIdLean(input.businessId);
    if (!biz) throw new HttpError(404, 'Business not found');

    const id = `inq-${randomUUID()}`;
    const created = await inquiryRepository.create({
      _id: id,
      ...input,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'unread',
    });
    return toInquiry(created.toObject());
  },

  async markRead(id: string, user: AuthTokenPayload) {
    const doc = await inquiryRepository.findById(id);
    if (!doc) throw new HttpError(404, 'Inquiry not found');

    if (user.role !== 'admin') {
      const biz = await businessRepository.findByIdLean(doc.businessId);
      if (!biz || biz.ownerId !== user.sub) throw new HttpError(403, 'Forbidden');
    }
    const updated = await inquiryRepository.markRead(doc);
    return toInquiry(updated.toObject());
  },
};
