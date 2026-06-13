import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      required: true,
      default: 'customer',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'banned'],
      required: true,
      default: 'active',
      index: true,
    },
    emailVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    avatarUrl: { type: String },
  },
  { timestamps: true, _id: false },
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: string };

export const UserModel =
  (mongoose.models.User as Model<UserDoc> | undefined) ?? model<UserDoc>('User', userSchema);
