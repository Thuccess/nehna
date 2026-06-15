import { BusinessModel } from '../models/Business.js';
import { FavoriteModel } from '../models/Favorite.js';
import { InquiryModel } from '../models/Inquiry.js';
import { OrderMessageModel } from '../models/OrderMessage.js';
import { OrderModel } from '../models/Order.js';
import { ProductModel } from '../models/Product.js';
import { UserModel } from '../models/User.js';
import { ReviewModel } from '../models/Review.js';
import { NewsArticleModel } from '../models/NewsArticle.js';
import { CommunityPostModel } from '../models/CommunityPost.js';
import { logger } from '../config/logger.js';

const models = [
  UserModel,
  BusinessModel,
  ProductModel,
  InquiryModel,
  FavoriteModel,
  OrderModel,
  OrderMessageModel,
  ReviewModel,
  NewsArticleModel,
  CommunityPostModel,
];

export async function ensureIndexes(): Promise<void> {
  for (const model of models) {
    await model.syncIndexes();
  }
  logger.info('MongoDB indexes synced');
}
