import type { CorsOptions } from 'cors';
import { corsOrigins } from './env.js';

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
};
