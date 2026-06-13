import { OrderMessageModel } from '../models/OrderMessage.js';

export const orderMessageRepository = {
  async findByOrderId(orderId: string) {
    return OrderMessageModel.find({ orderId }).sort({ createdAt: 1 }).lean();
  },

  async create(data: Parameters<typeof OrderMessageModel.create>[0]) {
    return OrderMessageModel.create(data);
  },
};
