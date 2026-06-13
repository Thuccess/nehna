import './types/auth.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
import { env } from './config/env.js';
import { ensureIndexes } from './db/indexes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFound.js';
import authRoutes from './routes/auth.routes.js';
import businessRoutes from './routes/businesses.routes.js';
import productRoutes from './routes/products.routes.js';
import inquiryRoutes from './routes/inquiries.routes.js';
import orderRoutes from './routes/orders.routes.js';
import favoriteRoutes from './routes/favorites.routes.js';
import userRoutes from './routes/users.routes.js';
import searchRoutes from './routes/search.routes.js';
import uploadsRoutes from './routes/uploads.routes.js';

export async function createApp(): Promise<express.Express> {
  await ensureIndexes();

  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  app.get('/health', (_req, res) => {
    res.json({ ok: true, env: env.NODE_ENV });
  });

  app.use('/auth', authRoutes);
  app.use('/businesses', businessRoutes);
  app.use('/products', productRoutes);
  app.use('/inquiries', inquiryRoutes);
  app.use('/orders', orderRoutes);
  app.use('/favorites', favoriteRoutes);
  app.use('/users', userRoutes);
  app.use('/search', searchRoutes);
  app.use('/uploads', uploadsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
