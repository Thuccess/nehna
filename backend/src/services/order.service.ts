import { randomUUID } from 'node:crypto';
import type { OrderInput, OrderMessageInput, OrderStatusUpdate } from '@adulis/shared';
import type { AuthTokenPayload } from '../types/auth.js';
import { HttpError } from '../middlewares/errorHandler.js';
import { toOrder, toOrderMessage } from '../models/serialize.js';
import { businessRepository } from '../repositories/business.repository.js';
import { orderMessageRepository } from '../repositories/orderMessage.repository.js';
import { orderRepository } from '../repositories/order.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { userRepository } from '../repositories/user.repository.js';

function formatTimestamp(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 16);
}

async function assertOrderAccess(orderId: string, user: AuthTokenPayload) {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new HttpError(404, 'Order not found');

  if (user.role === 'admin') return order;

  if (order.buyerId === user.sub) return order;

  if (user.role === 'seller') {
    const biz = await businessRepository.findByIdLean(order.businessId);
    if (biz?.ownerId === user.sub) return order;
  }

  throw new HttpError(403, 'Forbidden');
}

export const orderService = {
  async list(user: AuthTokenPayload) {
    const filter: Record<string, unknown> = {};

    if (user.role === 'admin') {
      // all orders
    } else if (user.role === 'seller') {
      const bizIds = await businessRepository.findIdsByOwnerId(user.sub);
      filter.businessId = { $in: bizIds.map((b) => b._id) };
    } else {
      filter.buyerId = user.sub;
    }

    const docs = await orderRepository.findWithFilter(filter);
    return docs.map(toOrder);
  },

  async getById(id: string, user: AuthTokenPayload) {
    const order = await assertOrderAccess(id, user);
    return toOrder(order.toObject());
  },

  async create(user: AuthTokenPayload, input: OrderInput) {
    const me = await userRepository.findByIdLean(user.sub);
    if (!me) throw new HttpError(404, 'User not found');
    if (me.status !== 'active') throw new HttpError(403, 'Account must be active to place orders');

    const biz = await businessRepository.findByIdLean(input.businessId);
    if (!biz || biz.status !== 'approved') {
      throw new HttpError(400, 'Business is not available for orders');
    }

    const lineItems: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      image?: string;
    }[] = [];
    let totalAmount = 0;

    for (const line of input.items) {
      const product = await productRepository.findByIdLean(line.productId);
      if (!product || product.businessId !== input.businessId) {
        throw new HttpError(400, `Product ${line.productId} is not available from this shop`);
      }
      if (!product.isAvailable) {
        throw new HttpError(400, `${product.name} is out of stock`);
      }
      lineItems.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: line.quantity,
        image: product.image,
      });
      totalAmount += product.price * line.quantity;
    }

    const orderId = `ord-${randomUUID()}`;
    const createdAt = formatTimestamp();
    const note = input.note?.trim() ?? '';

    await orderRepository.create({
      _id: orderId,
      buyerId: user.sub,
      buyerName: me.name,
      buyerPhone: me.phone,
      businessId: biz._id,
      businessName: biz.name,
      items: lineItems,
      totalAmount,
      note,
      status: 'pending',
      createdAt,
    });

    const initialMessage = note || `Order placed for ${lineItems.length} item(s). Total UGX ${totalAmount.toLocaleString()}.`;
    await orderMessageRepository.create({
      _id: `msg-${randomUUID()}`,
      orderId,
      senderId: user.sub,
      senderName: me.name,
      senderRole: 'buyer',
      body: initialMessage,
      createdAt,
    });

    const doc = await orderRepository.findById(orderId);
    return toOrder(doc!.toObject());
  },

  async updateStatus(id: string, user: AuthTokenPayload, input: OrderStatusUpdate) {
    const order = await assertOrderAccess(id, user);
    if (user.role === 'customer' && order.buyerId !== user.sub) {
      throw new HttpError(403, 'Forbidden');
    }
    if (user.role === 'seller') {
      const biz = await businessRepository.findByIdLean(order.businessId);
      if (!biz || biz.ownerId !== user.sub) throw new HttpError(403, 'Forbidden');
    }

    const updated = await orderRepository.updateStatus(id, input.status);
    if (!updated) throw new HttpError(404, 'Order not found');

    const me = await userRepository.findByIdLean(user.sub);
    const statusLabel = input.status;
    await orderMessageRepository.create({
      _id: `msg-${randomUUID()}`,
      orderId: id,
      senderId: user.sub,
      senderName: me?.name ?? 'System',
      senderRole: user.role === 'admin' ? 'admin' : user.role === 'seller' ? 'seller' : 'buyer',
      body: `Order status updated to ${statusLabel}.`,
      createdAt: formatTimestamp(),
    });

    return toOrder(updated.toObject());
  },

  async listMessages(orderId: string, user: AuthTokenPayload) {
    await assertOrderAccess(orderId, user);
    const docs = await orderMessageRepository.findByOrderId(orderId);
    return docs.map(toOrderMessage);
  },

  async addMessage(orderId: string, user: AuthTokenPayload, input: OrderMessageInput) {
    const order = await assertOrderAccess(orderId, user);
    const me = await userRepository.findByIdLean(user.sub);
    if (!me) throw new HttpError(404, 'User not found');

    let senderRole: 'buyer' | 'seller' | 'admin' = 'buyer';
    if (user.role === 'admin') senderRole = 'admin';
    else if (user.role === 'seller') senderRole = 'seller';
    else if (order.buyerId !== user.sub) throw new HttpError(403, 'Forbidden');

    const created = await orderMessageRepository.create({
      _id: `msg-${randomUUID()}`,
      orderId,
      senderId: user.sub,
      senderName: me.name,
      senderRole,
      body: input.body.trim(),
      createdAt: formatTimestamp(),
    });

    return toOrderMessage(created.toObject());
  },
};
