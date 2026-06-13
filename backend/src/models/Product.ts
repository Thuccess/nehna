import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const productSchema = new Schema(
  {
    _id: { type: String, required: true },
    businessId: { type: String, required: true, index: true, ref: 'Business' },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, index: true },
    isAvailable: { type: Boolean, required: true, default: true, index: true },
    isSponsored: { type: Boolean, default: false, index: true },
    createdAt: { type: String, required: true },
  },
  { _id: false, timestamps: { createdAt: false, updatedAt: true } },
);

productSchema.index({ businessId: 1, isAvailable: 1 });

export type ProductDoc = InferSchemaType<typeof productSchema> & { _id: string };

export const ProductModel =
  (mongoose.models.Product as Model<ProductDoc> | undefined) ??
  model<ProductDoc>('Product', productSchema);
