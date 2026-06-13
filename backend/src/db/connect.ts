import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

mongoose.set('strictQuery', true);

export async function connectMongo(uri = env.MONGODB_URI): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  try {
    await mongoose.connect(uri, {
      autoIndex: env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 15000,
    });
    logger.info({ host: mongoose.connection.host }, 'MongoDB connected');
    return mongoose;
  } catch (err) {
    logger.error({ err }, 'MongoDB connection failed');
    throw err;
  }
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}
