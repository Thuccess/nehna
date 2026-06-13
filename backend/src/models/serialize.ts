import type { Business, Inquiry, Order, OrderMessage, Product, User } from '@adulis/shared';
import type { BusinessDoc } from './Business.js';
import type { InquiryDoc } from './Inquiry.js';
import type { OrderDoc } from './Order.js';
import type { OrderMessageDoc } from './OrderMessage.js';
import type { ProductDoc } from './Product.js';
import type { UserDoc } from './User.js';

type WithMongoId<T> = T & { _id: string; __v?: number };

function isPlaceholderEmail(email: string): boolean {
  return email.endsWith('@users.nehnax.app');
}

export function toUser(doc: WithMongoId<UserDoc>): User {
  const email = doc.email && !isPlaceholderEmail(doc.email) ? doc.email : undefined;
  return {
    id: doc._id,
    name: doc.name,
    email,
    phone: doc.phone,
    role: doc.role,
    status: doc.status,
    avatarUrl: doc.avatarUrl ?? undefined,
    emailVerified: doc.emailVerified ?? false,
  };
}

export function toBusiness(doc: WithMongoId<BusinessDoc>): Business {
  return {
    id: doc._id,
    ownerId: doc.ownerId,
    name: doc.name,
    ownerName: doc.ownerName,
    description: doc.description,
    category: doc.category,
    address: doc.address,
    neighborhood: doc.neighborhood,
    phone: doc.phone,
    whatsAppNumber: doc.whatsAppNumber,
    logo: doc.logo,
    coverImage: doc.coverImage,
    status: doc.status,
    package: doc.package,
    mapsUrl: doc.mapsUrl ?? undefined,
    features: doc.features ?? [],
    createdAt: doc.createdAt,
  };
}

export function toProduct(doc: WithMongoId<ProductDoc>): Product {
  return {
    id: doc._id,
    businessId: doc.businessId,
    name: doc.name,
    price: doc.price,
    description: doc.description,
    image: doc.image,
    category: doc.category,
    isAvailable: doc.isAvailable,
    isSponsored: doc.isSponsored ?? false,
    createdAt: doc.createdAt,
  };
}

export function toInquiry(doc: WithMongoId<InquiryDoc>): Inquiry {
  return {
    id: doc._id,
    productId: doc.productId ?? undefined,
    businessId: doc.businessId,
    buyerName: doc.buyerName,
    buyerPhone: doc.buyerPhone,
    message: doc.message,
    createdAt: doc.createdAt,
    status: doc.status,
  };
}

export function toOrder(doc: WithMongoId<OrderDoc>): Order {
  return {
    id: doc._id,
    buyerId: doc.buyerId,
    buyerName: doc.buyerName,
    buyerPhone: doc.buyerPhone,
    businessId: doc.businessId,
    businessName: doc.businessName,
    items: doc.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      image: item.image ?? undefined,
    })),
    totalAmount: doc.totalAmount,
    note: doc.note,
    status: doc.status,
    createdAt: doc.createdAt,
  };
}

export function toOrderMessage(doc: WithMongoId<OrderMessageDoc>): OrderMessage {
  return {
    id: doc._id,
    orderId: doc.orderId,
    senderId: doc.senderId,
    senderName: doc.senderName,
    senderRole: doc.senderRole,
    body: doc.body,
    createdAt: doc.createdAt,
  };
}
