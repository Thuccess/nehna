import type { RequestHandler } from 'express';
import type { OrderInput, OrderMessageInput, OrderStatusUpdate } from '@adulis/shared';
import { orderService } from '../services/order.service.js';

export const orderController = {
  list: (async (req, res) => {
    const orders = await orderService.list(req.user!);
    res.json({ orders });
  }) as RequestHandler,

  get: (async (req, res) => {
    const order = await orderService.getById(req.params.id, req.user!);
    res.json({ order });
  }) as RequestHandler,

  create: (async (req, res) => {
    const input = req.body as OrderInput;
    const order = await orderService.create(req.user!, input);
    res.status(201).json({ order });
  }) as RequestHandler,

  updateStatus: (async (req, res) => {
    const input = req.body as OrderStatusUpdate;
    const order = await orderService.updateStatus(req.params.id, req.user!, input);
    res.json({ order });
  }) as RequestHandler,

  listMessages: (async (req, res) => {
    const messages = await orderService.listMessages(req.params.id, req.user!);
    res.json({ messages });
  }) as RequestHandler,

  addMessage: (async (req, res) => {
    const input = req.body as OrderMessageInput;
    const message = await orderService.addMessage(req.params.id, req.user!, input);
    res.status(201).json({ message });
  }) as RequestHandler,
};
