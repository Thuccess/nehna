import { OrderModel } from '../models/Order.js';

export const orderRepository = {
  async findWithFilter(filter: Record<string, unknown>) {
    return OrderModel.find(filter).sort({ createdAt: -1 }).lean();
  },

  async findById(id: string) {
    return OrderModel.findById(id);
  },

  async create(data: Parameters<typeof OrderModel.create>[0]) {
    return OrderModel.create(data);
  },

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled') {
    return OrderModel.findByIdAndUpdate(id, { status }, { new: true });
  },
};
