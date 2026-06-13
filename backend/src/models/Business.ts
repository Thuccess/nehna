import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const businessSchema = new Schema(
  {
    _id: { type: String, required: true },
    ownerId: { type: String, required: true, index: true, ref: 'User' },
    name: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    address: { type: String, required: true },
    neighborhood: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    whatsAppNumber: { type: String, required: true },
    logo: { type: String, required: true },
    coverImage: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'suspended'],
      required: true,
      default: 'pending',
      index: true,
    },
    package: {
      type: String,
      enum: ['basic', 'premium', 'featured', 'top_featured'],
      required: true,
      default: 'basic',
      index: true,
    },
    mapsUrl: { type: String },
    features: { type: [String], default: [] },
    createdAt: { type: String, required: true },
  },
  { _id: false, timestamps: { createdAt: false, updatedAt: true } },
);

businessSchema.index({ status: 1, category: 1, neighborhood: 1 });

export type BusinessDoc = InferSchemaType<typeof businessSchema> & { _id: string };

export const BusinessModel =
  (mongoose.models.Business as Model<BusinessDoc> | undefined) ??
  model<BusinessDoc>('Business', businessSchema);
