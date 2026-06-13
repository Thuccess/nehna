import type { RequestHandler } from 'express';
import type { UpdateUserInput } from '@adulis/shared';
import { userService } from '../services/user.service.js';
import type { listQuerySchema } from '../validators/user.schema.js';
import type { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

export const userController = {
  list: (async (req, res) => {
    const q = req.query as unknown as ListQuery;
    const users = await userService.list(q);
    res.json({ users });
  }) as RequestHandler,

  update: (async (req, res) => {
    const input = req.body as UpdateUserInput;
    const user = await userService.update(req.params.id, input);
    res.json({ user });
  }) as RequestHandler,

  approve: (async (req, res) => {
    const user = await userService.update(req.params.id, { status: 'active' });
    res.json({ user });
  }) as RequestHandler,
};
