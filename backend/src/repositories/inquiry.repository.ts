import type { InquiryInput } from '@adulis/shared';
import type { HydratedDocument } from 'mongoose';
import { InquiryModel, type InquiryDoc } from '../models/Inquiry.js';

type InquiryDocument = HydratedDocument<InquiryDoc>;

export const inquiryRepository = {
  async findWithFilter(filter: Record<string, unknown>) {
    return InquiryModel.find(filter).sort({ createdAt: -1 }).lean();
  },

  async findById(id: string) {
    return InquiryModel.findById(id);
  },

  async create(data: InquiryInput & { _id: string; createdAt: string; status: 'unread' | 'read' }) {
    return InquiryModel.create(data);
  },

  async markRead(doc: InquiryDocument) {
    doc.status = 'read';
    await doc.save();
    return doc;
  },
};
