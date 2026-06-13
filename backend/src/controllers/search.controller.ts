import type { RequestHandler } from 'express';
import type { SearchQuery } from '@adulis/shared';
import { searchBusinesses, searchProducts } from '../services/search.service.js';

export const searchController = {
  search: (async (req, res) => {
    const q = req.query as unknown as SearchQuery;
    if (q.type === 'business') {
      const businesses = await searchBusinesses({ q: q.q, limit: q.limit });
      res.json({ type: 'business', results: businesses });
      return;
    }
    const products = await searchProducts({ q: q.q, limit: q.limit });
    res.json({ type: 'product', results: products });
  }) as RequestHandler,
};
