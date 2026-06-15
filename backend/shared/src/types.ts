import type {
  Language,
  UserRole,
  UserStatus,
  BusinessStatus,
  BusinessPackage,
  FavoriteItemType,
  InquiryStatus,
  OrderStatus,
  MessageSenderRole,
  UploadKind,
} from './enums.js';

export type {
  Language,
  UserRole,
  UserStatus,
  BusinessStatus,
  BusinessPackage,
  FavoriteItemType,
  InquiryStatus,
  OrderStatus,
  MessageSenderRole,
  UploadKind,
};

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  status?: UserStatus;
  avatarUrl?: string;
  emailVerified?: boolean;
}

export interface BusinessCreateResponse {
  business: Business;
  user?: User;
  token?: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  ownerName: string;
  description: string;
  category: string;
  address: string;
  neighborhood: string;
  phone: string;
  whatsAppNumber: string;
  logo: string;
  coverImage: string;
  status: BusinessStatus;
  package: BusinessPackage;
  mapsUrl?: string;
  features?: string[];
  galleryImages?: string[];
  openingHours?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isAvailable: boolean;
  createdAt: string;
  isSponsored?: boolean;
}

export interface AdPackage {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface Favorite {
  userId: string;
  itemType: FavoriteItemType;
  itemId: string;
}

export interface Inquiry {
  id: string;
  productId?: string;
  businessId: string;
  buyerName: string;
  buyerPhone: string;
  message: string;
  createdAt: string;
  status: InquiryStatus;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  businessId: string;
  businessName: string;
  items: OrderItem[];
  totalAmount: number;
  note: string;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: MessageSenderRole;
  body: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface SellerRegisterResponse {
  user: User;
  business: Business;
  token?: string;
}

export interface PresignResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export type NewsSection = 'eri_news' | 'uga_news';

export interface NewsArticle {
  id: string;
  section: NewsSection;
  title: string;
  body: string;
  imageUrl?: string;
  authorId: string;
  publishedAt: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  businessId: string;
  authorId: string;
  title?: string;
  body: string;
  productId?: string;
  imageUrl?: string;
  createdAt: string;
  businessName?: string;
  businessLogo?: string;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
