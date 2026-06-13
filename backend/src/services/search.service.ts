import type { Business, Product } from '@adulis/shared';
import { businessRepository } from '../repositories/business.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { toBusiness, toProduct } from '../models/serialize.js';

export interface SearchOptions {
  q: string;
  limit?: number;
}

function escapeForRegex(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

async function fallbackBusinessSearch({ q, limit = 20 }: SearchOptions): Promise<Business[]> {
  const re = new RegExp(escapeForRegex(q), 'i');
  const docs = await businessRepository.searchFallback(re, limit);
  return docs.map(toBusiness);
}

async function fallbackProductSearch({ q, limit = 20 }: SearchOptions): Promise<Product[]> {
  const re = new RegExp(escapeForRegex(q), 'i');
  const docs = await productRepository.searchFallback(re, limit);
  return docs.map(toProduct);
}

export async function searchBusinesses(opts: SearchOptions): Promise<Business[]> {
  const { q, limit = 20 } = opts;
  try {
    const results = await businessRepository.searchAggregate(q, limit);
    if (results.length === 0) return fallbackBusinessSearch(opts);
    return results.map((d) => toBusiness(d as unknown as Parameters<typeof toBusiness>[0]));
  } catch {
    return fallbackBusinessSearch(opts);
  }
}

export async function searchProducts(opts: SearchOptions): Promise<Product[]> {
  const { q, limit = 20 } = opts;
  try {
    const results = await productRepository.searchAggregate(q, limit);
    if (results.length === 0) return fallbackProductSearch(opts);
    return results.map((d) => toProduct(d as unknown as Parameters<typeof toProduct>[0]));
  } catch {
    return fallbackProductSearch(opts);
  }
}
