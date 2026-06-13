import type { UpdateUserInput } from '@adulis/shared';
import type { HydratedDocument } from 'mongoose';
import { UserModel, type UserDoc } from '../models/User.js';

type UserDocument = HydratedDocument<UserDoc>;

export const userRepository = {
  async findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).lean();
  },

  async findByEmailWithPassword(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  async findByPhone(phone: string) {
    return UserModel.findOne({ phone }).lean();
  },

  async findByPhoneWithPassword(phone: string) {
    return UserModel.findOne({ phone });
  },

  async findByResetToken(token: string) {
    return UserModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });
  },

  async findByIdLean(id: string) {
    return UserModel.findById(id).lean();
  },

  async findById(id: string) {
    return UserModel.findById(id);
  },

  async create(data: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: UserDoc['role'];
    status: UserDoc['status'];
    avatarUrl?: string;
    emailVerified?: boolean;
  }) {
    return UserModel.create(data);
  },

  async findWithFilter(filter: Record<string, unknown>, limit: number) {
    return UserModel.find(filter).limit(limit).sort({ createdAt: -1 }).lean();
  },

  async applyUpdate(doc: UserDocument | null, input: UpdateUserInput) {
    if (!doc) return null;
    for (const [k, v] of Object.entries(input)) {
      if (v === undefined) continue;
      (doc as unknown as Record<string, unknown>)[k] = v;
    }
    await doc.save();
    return doc;
  },
};
