import type { UpdateUserInput } from '@adulis/shared';
import { HttpError } from '../middlewares/errorHandler.js';
import { toUser } from '../models/serialize.js';
import { userRepository } from '../repositories/user.repository.js';
import type { listQuerySchema } from '../validators/user.schema.js';
import type { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

function escapeRegex(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export const userService = {
  async list(q: ListQuery) {
    const filter: Record<string, unknown> = {};
    if (q.role) filter.role = q.role;
    if (q.status) filter.status = q.status;
    if (q.q) {
      const re = new RegExp(escapeRegex(q.q), 'i');
      filter.$or = [{ name: re }, { email: re }, { phone: re }];
    }
    const docs = await userRepository.findWithFilter(filter, q.limit);
    return docs.map(toUser);
  },

  async update(id: string, input: UpdateUserInput) {
    const doc = await userRepository.findById(id);
    if (!doc) throw new HttpError(404, 'User not found');
    const updated = await userRepository.applyUpdate(doc, input);
    return toUser(updated!.toObject());
  },
};
