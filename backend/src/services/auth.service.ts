import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  SellerRegisterInput,
} from '@adulis/shared';
import { signToken } from '../config/jwt.js';
import { logger } from '../config/logger.js';
import { isEmailIdentifier, normalizePhone } from '../lib/phone.js';
import { HttpError } from '../middlewares/errorHandler.js';
import { toUser } from '../models/serialize.js';
import { userRepository } from '../repositories/user.repository.js';
import { businessService } from './business.service.js';

function placeholderEmailForId(id: string): string {
  return `${id}@users.nehnax.app`;
}

function isPlaceholderEmail(email: string): boolean {
  return email.endsWith('@users.nehnax.app');
}

type PendingUserInput = {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: 'customer' | 'seller';
  avatarUrl?: string;
};

export const authService = {
  async register(input: RegisterInput) {
    const role = input.role === 'seller' ? 'seller' : 'customer';
    if (role === 'seller') {
      throw new HttpError(400, 'Use seller registration for business accounts');
    }
    const user = await this.createPendingUser({
      name: input.name,
      phone: input.phone,
      email: input.email,
      password: input.password,
      role: 'customer',
      avatarUrl: input.avatarUrl,
    });
    return { user };
  },

  async registerSeller(input: SellerRegisterInput) {
    const user = await this.createPendingUser({
      name: input.name,
      phone: input.phone,
      email: input.email,
      password: input.password,
      role: 'seller',
    });
    const business = await businessService.create(user.id, input.business);
    return { user, business };
  },

  async createPendingUser(input: PendingUserInput) {
    const phone = normalizePhone(input.phone);
    const existingPhone = await userRepository.findByPhone(phone);
    if (existingPhone) throw new HttpError(409, 'Phone number already registered');

    if (input.email) {
      const existing = await userRepository.findByEmail(input.email);
      if (existing) throw new HttpError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const id = `user-${randomUUID()}`;
    const email = input.email?.toLowerCase() ?? placeholderEmailForId(id);

    const created = await userRepository.create({
      _id: id,
      name: input.name,
      email,
      phone,
      passwordHash,
      role: input.role,
      status: 'pending',
      avatarUrl: input.avatarUrl,
      emailVerified: false,
    });

    return toUser(created.toObject());
  },

  async login(input: LoginInput) {
    const identifier = input.identifier.trim();
    const doc = isEmailIdentifier(identifier)
      ? await userRepository.findByEmailWithPassword(identifier.toLowerCase())
      : await userRepository.findByPhoneWithPassword(normalizePhone(identifier));

    if (!doc) throw new HttpError(401, 'Invalid credentials');
    if (doc.status === 'banned') throw new HttpError(403, 'Account is banned');
    if (doc.status === 'pending') {
      throw new HttpError(
        403,
        'Account is awaiting admin approval. Please check back soon.',
      );
    }

    const ok = await bcrypt.compare(input.password, doc.passwordHash);
    if (!ok) throw new HttpError(401, 'Invalid credentials');

    if (input.intent === 'buyer' && doc.role !== 'customer') {
      if (doc.role === 'admin') {
        // allow admin on buyer login for convenience
      } else {
        throw new HttpError(403, 'This account is registered as a seller. Use seller sign-in.');
      }
    }
    if (input.intent === 'seller' && doc.role !== 'seller' && doc.role !== 'admin') {
      throw new HttpError(403, 'This account is not a seller. Use buyer sign-in.');
    }

    const user = toUser(doc.toObject());
    const token = signToken({ sub: user.id, role: user.role });
    return { user, token };
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const doc = await userRepository.findByEmailWithPassword(input.email.toLowerCase());
    if (!doc || isPlaceholderEmail(doc.email)) {
      return { ok: true as const };
    }

    const token = randomBytes(32).toString('hex');
    doc.passwordResetToken = token;
    doc.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await doc.save();

    logger.info({ email: doc.email, resetPath: `/reset-password?token=${token}` }, 'Password reset link');
    return { ok: true as const };
  },

  async resetPassword(input: ResetPasswordInput) {
    const doc = await userRepository.findByResetToken(input.token);
    if (!doc) throw new HttpError(400, 'Invalid or expired reset link');

    doc.passwordHash = await bcrypt.hash(input.password, 10);
    doc.passwordResetToken = undefined;
    doc.passwordResetExpires = undefined;
    await doc.save();
    return { ok: true as const };
  },

  async updateMe(userId: string, input: { name?: string; phone?: string; avatarUrl?: string }) {
    const doc = await userRepository.findById(userId);
    if (!doc) throw new HttpError(404, 'User not found');
    if (input.name !== undefined) doc.name = input.name;
    if (input.phone !== undefined) doc.phone = normalizePhone(input.phone);
    if (input.avatarUrl !== undefined) doc.avatarUrl = input.avatarUrl;
    await doc.save();
    return toUser(doc.toObject());
  },

  async approve(userId: string) {
    const doc = await userRepository.findById(userId);
    if (!doc) throw new HttpError(404, 'User not found');
    doc.status = 'active';
    await doc.save();
    return toUser(doc.toObject());
  },

  async getMe(userId: string) {
    const doc = await userRepository.findByIdLean(userId);
    if (!doc) throw new HttpError(404, 'User not found');
    return toUser(doc);
  },
};
