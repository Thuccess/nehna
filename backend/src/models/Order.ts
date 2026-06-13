import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    _id: { type: String, required: true },
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true, trim: true },
    buyerPhone: { type: String, required: true, trim: true },
    businessId: { type: String, required: true, index: true, ref: 'Business' },
    businessName: { type: String, required: true, trim: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'fulfilled', 'cancelled'],
      required: true,
      default: 'pending',
      index: true,
    },
    createdAt: { type: String, required: true },
  },
  { _id: false, timestamps: { createdAt: false, updatedAt: true } },
);

orderSchema.index({ businessId: 1, createdAt: -1 });
orderSchema.index({ buyerId: 1, createdAt: -1 });

export type OrderDoc = InferSchemaType<typeof orderSchema> & { _id: string };

export const OrderModel =
  (mongoose.models.Order as Model<OrderDoc> | undefined) ?? model<OrderDoc>('Order', orderSchema);
