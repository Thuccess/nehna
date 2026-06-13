import { z } from 'zod';

export const languageSchema = z.enum(['en', 'ti']);

export const userRoleSchema = z.enum(['customer', 'seller', 'admin']);

export const userStatusSchema = z.enum(['pending', 'active', 'banned']);

export const businessStatusSchema = z.enum(['pending', 'approved', 'suspended']);

export const businessPackageSchema = z.enum(['basic', 'premium', 'featured', 'top_featured']);

export const favoriteItemTypeSchema = z.enum(['product', 'business']);

export const inquiryStatusSchema = z.enum(['unread', 'read']);

export const orderStatusSchema = z.enum(['pending', 'confirmed', 'fulfilled', 'cancelled']);

export const messageSenderRoleSchema = z.enum(['buyer', 'seller', 'admin']);

export const uploadKindSchema = z.enum(['logo', 'cover', 'product', 'avatar']);

export const registerInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  email: z
    .union([z.string().trim().email(), z.literal('')])
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : v)),
  password: z.string().min(8).max(128),
  avatarUrl: z.string().url().optional(),
  role: userRoleSchema
    .refine((r) => r === 'customer' || r === 'seller', 'Invalid registration role')
    .default('customer'),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  identifier: z.string().trim().min(3).max(200),
  password: z.string().min(1),
  intent: z.enum(['buyer', 'seller']).optional(),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const forgotPasswordInputSchema = z.object({
  email: z.string().trim().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;

export const resetPasswordInputSchema = z.object({
  token: z.string().trim().min(1),
  password: z.string().min(8).max(128),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

/** Relaxed schema for mobile seller onboarding (logo/cover/description optional). */
export const businessOnboardingInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(80),
  neighborhood: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  whatsAppNumber: z.string().trim().min(7).max(20),
  address: z.string().trim().max(240).optional().default(''),
  description: z.string().trim().max(2000).optional().default(''),
  logo: z.string().url().optional(),
  coverImage: z.string().url().optional(),
});
export type BusinessOnboardingInput = z.infer<typeof businessOnboardingInputSchema>;

export const sellerRegisterInputSchema = registerInputSchema
  .omit({ role: true, avatarUrl: true })
  .extend({
    business: businessOnboardingInputSchema,
  });
export type SellerRegisterInput = z.infer<typeof sellerRegisterInputSchema>;

export const updateUserInputSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  avatarUrl: z.string().url().optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const businessInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  ownerName: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(2000),
  category: z.string().trim().min(2).max(80),
  address: z.string().trim().min(2).max(240),
  neighborhood: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  whatsAppNumber: z.string().trim().min(7).max(20),
  logo: z.string().url(),
  coverImage: z.string().url(),
  mapsUrl: z.string().url().optional(),
  features: z.array(z.string().min(1)).max(20).optional(),
});
export type BusinessInput = z.infer<typeof businessInputSchema>;

export const businessUpdateSchema = businessInputSchema.partial().extend({
  status: businessStatusSchema.optional(),
  package: businessPackageSchema.optional(),
});
export type BusinessUpdate = z.infer<typeof businessUpdateSchema>;

export const productInputSchema = z.object({
  businessId: z.string().trim().min(1),
  name: z.string().trim().min(2).max(180),
  price: z.number().int().nonnegative(),
  description: z.string().trim().min(2).max(2000),
  image: z.string().url(),
  category: z.string().trim().min(2).max(80),
  isAvailable: z.boolean().default(true),
  isSponsored: z.boolean().optional(),
});
export type ProductInput = z.infer<typeof productInputSchema>;

export const productUpdateSchema = productInputSchema.partial();
export type ProductUpdate = z.infer<typeof productUpdateSchema>;

export const inquiryInputSchema = z.object({
  businessId: z.string().trim().min(1),
  productId: z.string().trim().min(1).optional(),
  buyerName: z.string().trim().min(2).max(120),
  buyerPhone: z.string().trim().min(7).max(20),
  message: z.string().trim().min(2).max(2000),
});
export type InquiryInput = z.infer<typeof inquiryInputSchema>;

export const orderItemInputSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(99),
});
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;

export const orderInputSchema = z.object({
  businessId: z.string().trim().min(1),
  items: z.array(orderItemInputSchema).min(1).max(50),
  note: z.string().trim().max(2000).default(''),
});
export type OrderInput = z.infer<typeof orderInputSchema>;

export const orderStatusUpdateSchema = z.object({
  status: orderStatusSchema,
});
export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;

export const orderMessageInputSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});
export type OrderMessageInput = z.infer<typeof orderMessageInputSchema>;

export const favoriteInputSchema = z.object({
  itemType: favoriteItemTypeSchema,
  itemId: z.string().trim().min(1),
});
export type FavoriteInput = z.infer<typeof favoriteInputSchema>;

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
  type: z.enum(['business', 'product']).default('business'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const presignInputSchema = z.object({
  contentType: z
    .string()
    .regex(/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i, 'Invalid content type')
    .max(120),
  kind: uploadKindSchema,
  filename: z.string().trim().min(1).max(200).optional(),
});
export type PresignInput = z.infer<typeof presignInputSchema>;
