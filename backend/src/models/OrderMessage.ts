import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const orderMessageSchema = new Schema(
  {
    _id: { type: String, required: true },
    orderId: { type: String, required: true, index: true, ref: 'Order' },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true, trim: true },
    senderRole: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      required: true,
    },
    body: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { _id: false, timestamps: { createdAt: false, updatedAt: false } },
);

orderMessageSchema.index({ orderId: 1, createdAt: 1 });

export type OrderMessageDoc = InferSchemaType<typeof orderMessageSchema> & { _id: string };

export const OrderMessageModel =
  (mongoose.models.OrderMessage as Model<OrderMessageDoc> | undefined) ??
  model<OrderMessageDoc>('OrderMessage', orderMessageSchema);
