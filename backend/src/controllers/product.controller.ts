import type { RequestHandler } from 'express';
import type { ProductInput, ProductUpdate } from '@adulis/shared';
import { productService } from '../services/product.service.js';
import type { listQuerySchema } from '../validators/product.schema.js';
import type { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

export const productController = {
  list: (async (req, res) => {
    const q = req.query as unknown as ListQuery;
    const products = await productService.list(q);
    res.json({ products });
  }) as RequestHandler,

  getById: (async (req, res) => {
    const product = await productService.getById(req.params.id);
    res.json({ product });
  }) as RequestHandler,

  create: (async (req, res) => {
    const input = req.body as ProductInput;
    const product = await productService.create(req.user!, input);
    res.status(201).json({ product });
  }) as RequestHandler,

  update: (async (req, res) => {
    const input = req.body as ProductUpdate;
    const product = await productService.update(req.params.id, req.user!, input);
    res.json({ product });
  }) as RequestHandler,

  delete: (async (req, res) => {
    await productService.delete(req.params.id, req.user!);
    res.json({ ok: true });
  }) as RequestHandler,
};
