import { vi } from 'vitest';

export function queryChain<T>(result: T) {
  return {
    limit: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    lean: vi.fn().mockResolvedValue(result),
  };
}

export function findOneLean<T>(result: T | null) {
  return { lean: vi.fn().mockResolvedValue(result) };
}

export function findByIdLean<T>(result: T | null) {
  return { lean: vi.fn().mockResolvedValue(result) };
}
