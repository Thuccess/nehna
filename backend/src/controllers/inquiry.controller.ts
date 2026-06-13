import type { RequestHandler } from 'express';
import type { InquiryInput } from '@adulis/shared';
import { inquiryService } from '../services/inquiry.service.js';

export const inquiryController = {
  list: (async (req, res) => {
    const mine = req.query.mine === '1' || req.query.mine === 'true';
    const inquiries = await inquiryService.list(req.user!, { mine });
    res.json({ inquiries });
  }) as RequestHandler,

  create: (async (req, res) => {
    const input = req.body as InquiryInput;
    const inquiry = await inquiryService.create(input);
    res.status(201).json({ inquiry });
  }) as RequestHandler,

  markRead: (async (req, res) => {
    const inquiry = await inquiryService.markRead(req.params.id, req.user!);
    res.json({ inquiry });
  }) as RequestHandler,
};
