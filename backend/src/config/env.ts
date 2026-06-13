import 'dotenv/config';
import { z } from 'zod';

const optionalEnvString = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.string().min(1).optional(),
);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  COOKIE_DOMAIN: optionalEnvString,
  COOKIE_SECURE: z
    .union([z.literal('true'), z.literal('false')])
    .default('false')
    .transform((v) => v === 'true'),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  R2_ACCOUNT_ID: optionalEnvString,
  R2_ACCESS_KEY_ID: optionalEnvString,
  R2_SECRET_ACCESS_KEY: optionalEnvString,
  R2_BUCKET: optionalEnvString,
  R2_PUBLIC_BASE_URL: z.preprocess(
    (value) => (value === '' || value === undefined ? undefined : value),
    z.string().url().optional(),
  ),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export const isR2Configured = Boolean(
  env.R2_ACCOUNT_ID &&
    env.R2_ACCESS_KEY_ID &&
    env.R2_SECRET_ACCESS_KEY &&
    env.R2_BUCKET &&
    env.R2_PUBLIC_BASE_URL,
);
