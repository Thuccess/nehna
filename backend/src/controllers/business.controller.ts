import type { RequestHandler } from 'express';
import type { BusinessOnboardingInput, BusinessUpdate } from '@adulis/shared';
import { signToken } from '../config/jwt.js';
import { toUser } from '../models/serialize.js';
import { businessService } from '../services/business.service.js';
import { setAuthCookie } from '../services/cookies.service.js';
import { userRepository } from '../repositories/user.repository.js';
import type { listQuerySchema } from '../validators/business.schema.js';
import type { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

export const businessController = {
  list: (async (req, res) => {
    const q = req.query as unknown as ListQuery;
    const businesses = await businessService.list(q, req.user);
    res.json({ businesses });
  }) as RequestHandler,

  getById: (async (req, res) => {
    const business = await businessService.getById(req.params.id);
    res.json({ business });
  }) as RequestHandler,

  create: (async (req, res) => {
    const input = req.body as BusinessOnboardingInput;
    const business = await businessService.create(req.user!.sub, input);
    const ownerDoc = await userRepository.findById(req.user!.sub);
    const user = ownerDoc ? toUser(ownerDoc.toObject()) : undefined;
    const token = user ? signToken({ sub: user.id, role: user.role }) : undefined;
    if (token) setAuthCookie(res, token);
    res.status(201).json({ business, user, token });
  }) as RequestHandler,

  update: (async (req, res) => {
    const input = req.body as BusinessUpdate;
    const business = await businessService.update(req.params.id, req.user!, input);
    res.json({ business });
  }) as RequestHandler,

  delete: (async (req, res) => {
    await businessService.delete(req.params.id);
    res.json({ ok: true });
  }) as RequestHandler,

  approve: (async (req, res) => {
    const business = await businessService.approve(req.params.id);
    res.json({ business });
  }) as RequestHandler,

  suspend: (async (req, res) => {
    const business = await businessService.suspend(req.params.id);
    res.json({ business });
  }) as RequestHandler,
};
