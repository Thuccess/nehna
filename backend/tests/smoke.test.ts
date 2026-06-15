import bcrypt from 'bcryptjs';
import { expect, it, vi } from 'vitest';

vi.mock('../src/db/connect.js', () => ({
  connectMongo: vi.fn().mockResolvedValue({}),
  disconnectMongo: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../src/db/indexes.js', () => ({
  ensureIndexes: vi.fn().mockResolvedValue(undefined),
}));
import { BusinessModel } from '../src/models/Business.js';
import { ProductModel } from '../src/models/Product.js';
import { UserModel } from '../src/models/User.js';
import { findByIdLean, findOneLean, queryChain } from './helpers/mongooseChain.js';
import { api, initTestApp } from './setup.js';

const sellerId = 'user-seller-1';

await initTestApp();

it('GET /health returns ok', async () => {
  const res = await api('GET', '/health');
  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({ ok: true, env: 'test' });
});

it('POST /auth/register creates a user', async () => {
  vi.spyOn(UserModel, 'findOne').mockReturnValue(findOneLean(null) as never);
  const passwordHash = await bcrypt.hash('password123', 10);
  vi.spyOn(UserModel, 'create').mockResolvedValue({
    toObject: () => ({
      _id: 'user-test-1',
      name: 'Test User',
      email: 'test@adulis.example',
      phone: '+256700000001',
      passwordHash,
      role: 'customer',
      status: 'pending',
      emailVerified: false,
    }),
  } as never);

  const res = await api('POST', '/auth/register', {
    body: {
      name: 'Test User',
      email: 'test@adulis.example',
      password: 'password123',
      phone: '+256700000001',
    },
  });

  expect(res.status).toBe(201);
  expect((res.body.user as { email: string }).email).toBe('test@adulis.example');
  expect((res.body.user as { status: string }).status).toBe('pending');
  expect(res.body.token).toBeUndefined();
});

it('POST /auth/login accepts valid credentials', async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  vi.spyOn(UserModel, 'findOne').mockResolvedValue({
    _id: 'user-test-1',
    name: 'Test User',
    email: 'test@adulis.example',
    phone: '+256700000001',
    passwordHash,
    role: 'customer',
    status: 'active',
    toObject: () => ({
      _id: 'user-test-1',
      name: 'Test User',
      email: 'test@adulis.example',
      phone: '+256700000001',
      passwordHash,
      role: 'customer',
      status: 'active',
    }),
  } as never);

  const res = await api('POST', '/auth/login', {
    body: { identifier: 'test@adulis.example', password: 'password123' },
  });

  expect(res.status).toBe(200);
  expect((res.body.user as { name: string }).name).toBe('Test User');
  expect(res.body.token).toBeTruthy();
});

it('POST /auth/login rejects pending users', async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  vi.spyOn(UserModel, 'findOne').mockResolvedValue({
    _id: 'user-pending-1',
    name: 'Pending User',
    email: 'pending@adulis.example',
    phone: '+256700000099',
    passwordHash,
    role: 'customer',
    status: 'pending',
    toObject: () => ({
      _id: 'user-pending-1',
      name: 'Pending User',
      email: 'pending@adulis.example',
      phone: '+256700000099',
      passwordHash,
      role: 'customer',
      status: 'pending',
    }),
  } as never);

  const res = await api('POST', '/auth/login', {
    body: { identifier: 'pending@adulis.example', password: 'password123' },
  });

  expect(res.status).toBe(403);
  expect(res.body.token).toBeUndefined();
});

it('POST /auth/login rejects invalid credentials', async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  vi.spyOn(UserModel, 'findOne').mockResolvedValue({
    passwordHash,
    status: 'active',
    toObject: () => ({ passwordHash, status: 'active' }),
  } as never);

  const res = await api('POST', '/auth/login', {
    body: { identifier: 'test@adulis.example', password: 'wrongpassword' },
  });

  expect(res.status).toBe(401);
});

it('GET /businesses lists businesses', async () => {
  vi.spyOn(BusinessModel, 'find').mockReturnValue(queryChain([]) as never);

  const res = await api('GET', '/businesses');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.businesses)).toBe(true);
});

it('POST /businesses creates a business and upgrades customer to seller', async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  vi.spyOn(UserModel, 'findOne').mockResolvedValue({
    _id: sellerId,
    name: 'Seller Test',
    email: 'seller@adulis.example',
    phone: '+256700000002',
    passwordHash,
    role: 'customer',
    status: 'active',
    toObject: () => ({
      _id: sellerId,
      name: 'Seller Test',
      email: 'seller@adulis.example',
      phone: '+256700000002',
      passwordHash,
      role: 'customer',
      status: 'active',
    }),
  } as never);

  const login = await api('POST', '/auth/login', {
    body: { identifier: 'seller@adulis.example', password: 'password123' },
  });
  const token = login.body.token as string;

  const saveMock = vi.fn().mockResolvedValue(undefined);
  vi.spyOn(UserModel, 'findById').mockReturnValue({
    _id: sellerId,
    name: 'Seller Test',
    role: 'customer',
    status: 'active',
    save: saveMock,
    toObject: () => ({
      _id: sellerId,
      name: 'Seller Test',
      email: 'seller@adulis.example',
      phone: '+256700000002',
      role: 'seller',
      status: 'active',
      emailVerified: false,
    }),
    lean: vi.fn().mockResolvedValue({
      _id: sellerId,
      name: 'Seller Test',
      role: 'customer',
      status: 'active',
    }),
  } as never);

  vi.spyOn(BusinessModel, 'find').mockReturnValue(queryChain([]) as never);
  vi.spyOn(BusinessModel, 'create').mockResolvedValue({
    toObject: () => ({
      _id: 'biz-test-1',
      ownerId: sellerId,
      name: 'Test Shop',
      ownerName: 'Seller Test',
      description: 'Test Shop on Nehna — connect with customers in Kampala.',
      category: 'Food',
      address: 'Kansanga',
      neighborhood: 'Kansanga',
      phone: '+256700000002',
      whatsAppNumber: '256700000002',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
      status: 'pending',
      package: 'basic',
      createdAt: '2026-06-12',
    }),
  } as never);

  const res = await api('POST', '/businesses', {
    token,
    body: {
      name: 'Test Shop',
      category: 'Food',
      neighborhood: 'Kansanga',
      phone: '+256700000002',
      whatsAppNumber: '256700000002',
    },
  });

  expect(res.status).toBe(201);
  expect((res.body.business as { status: string }).status).toBe('pending');
  expect((res.body.business as { name: string }).name).toBe('Test Shop');
  expect(saveMock).toHaveBeenCalled();
});

it('GET /products lists products', async () => {
  vi.spyOn(ProductModel, 'find').mockReturnValue(queryChain([]) as never);

  const res = await api('GET', '/products');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.products)).toBe(true);
});

it('GET /products/:id returns 404 for unknown product', async () => {
  vi.spyOn(ProductModel, 'findById').mockReturnValue(findByIdLean(null) as never);

  const res = await api('GET', '/products/nonexistent-id');
  expect(res.status).toBe(404);
});
