import type { RequestHandler } from 'express';
import { ZodError, type ZodTypeAny, type infer as ZodInfer } from 'zod';

type Source = 'body' | 'query' | 'params';

export function validate<S extends ZodTypeAny>(schema: S, source: Source = 'body'): RequestHandler {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source]) as ZodInfer<S>;
      (req as unknown as Record<string, unknown>)[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(err);
        return;
      }
      next(err);
    }
  };
}
