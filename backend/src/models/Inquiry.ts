import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const inquirySchema = new Schema(
  {
    _id: { type: String, required: true },
    productId: { type: String, ref: 'Product' },
    businessId: { type: String, required: true, index: true, ref: 'Business' },
    buyerName: { type: String, required: true, trim: true },
    buyerPhone: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    createdAt: { type: String, required: true },
    status: {
      type: String,
      enum: ['unread', 'read'],
      required: true,
      default: 'unread',
      index: true,
    },
  },
  { _id: false, timestamps: { createdAt: false, updatedAt: true } },
);

export type InquiryDoc = InferSchemaType<typeof inquirySchema> & { _id: string };

export const InquiryModel =
  (mongoose.models.Inquiry as Model<InquiryDoc> | undefined) ??
  model<InquiryDoc>('Inquiry', inquirySchema);
