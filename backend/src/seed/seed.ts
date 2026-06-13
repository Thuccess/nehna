import bcrypt from 'bcryptjs';
import { connectMongo, disconnectMongo } from '../db/connect.js';
import { UserModel } from '../models/User.js';
import { BusinessModel } from '../models/Business.js';
import { ProductModel } from '../models/Product.js';
import { InquiryModel } from '../models/Inquiry.js';
import { logger } from '../config/logger.js';
import {
  DEFAULT_ADMIN_SEED_PASSWORD,
  REMOVED_LEGACY_SEED_USER_IDS,
  seedBusinesses,
  seedInquiries,
  seedProducts,
  seedUsers,
} from './seedData.js';

async function seed(): Promise<void> {
  await connectMongo();
  logger.info('Seeding NehnaX dataset...');

  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? DEFAULT_ADMIN_SEED_PASSWORD;

  const removed = await UserModel.deleteMany({ _id: { $in: REMOVED_LEGACY_SEED_USER_IDS } });
  if (removed.deletedCount > 0) {
    logger.info({ count: removed.deletedCount }, 'Removed legacy demo quick-switch users');
  }

  for (const user of seedUsers) {
    const passwordPlain =
      user.role === 'admin' ? adminPassword : user.passwordPlain;
    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    await UserModel.updateOne(
      { _id: user.id },
      {
        $set: {
          _id: user.id,
          name: user.name,
          email: user.email!.toLowerCase(),
          phone: user.phone,
          passwordHash,
          role: user.role,
          status: user.seedStatus ?? 'active',
          avatarUrl: user.avatarUrl,
          emailVerified: user.role === 'admin',
        },
      },
      { upsert: true },
    );
  }
  logger.info({ count: seedUsers.length }, 'Upserted seed users');

  const admin = seedUsers.find((u) => u.role === 'admin');
  if (admin) {
    logger.info(
      {
        email: admin.email,
        phone: admin.phone,
        adminUrl: '/admin',
        note: 'Set ADMIN_SEED_PASSWORD in env to override default admin password',
      },
      'NehnaX admin login (sign in at /login, then open /admin)',
    );
  }

  for (const biz of seedBusinesses) {
    await BusinessModel.updateOne(
      { _id: biz.id },
      { $set: { ...biz, _id: biz.id } },
      { upsert: true },
    );
  }
  logger.info({ count: seedBusinesses.length }, 'Upserted businesses');

  for (const prod of seedProducts) {
    await ProductModel.updateOne(
      { _id: prod.id },
      { $set: { ...prod, _id: prod.id } },
      { upsert: true },
    );
  }
  logger.info({ count: seedProducts.length }, 'Upserted products');

  for (const inq of seedInquiries) {
    await InquiryModel.updateOne(
      { _id: inq.id },
      { $set: { ...inq, _id: inq.id } },
      { upsert: true },
    );
  }
  logger.info({ count: seedInquiries.length }, 'Upserted inquiries');

  await disconnectMongo();
  logger.info('Seed complete.');
}

seed().catch((err) => {
  logger.error({ err }, 'Seed failed');
  process.exit(1);
});
