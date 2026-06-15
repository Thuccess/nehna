/**
 * One-time migration: map legacy category values to new taxonomy.
 * Run: npm run migrate:categories (from backend/)
 */
import 'dotenv/config';
import { connectMongo } from '../db/connect.js';
import { BusinessModel } from '../models/Business.js';
import { ProductModel } from '../models/Product.js';
import { LEGACY_CATEGORY_MAP } from '@adulis/shared/constants';

function mapCategory(value: string): string {
  return LEGACY_CATEGORY_MAP[value] ?? value;
}

async function main() {
  await connectMongo();

  const businesses = await BusinessModel.find({});
  let bizUpdated = 0;
  for (const biz of businesses) {
    const mapped = mapCategory(biz.category);
    if (mapped !== biz.category) {
      biz.category = mapped;
      await biz.save();
      bizUpdated++;
    }
  }

  const products = await ProductModel.find({});
  let prodUpdated = 0;
  for (const prod of products) {
    const mapped = mapCategory(prod.category);
    if (mapped !== prod.category) {
      prod.category = mapped;
      await prod.save();
      prodUpdated++;
    }
  }

  console.log(`Migrated categories: ${bizUpdated} businesses, ${prodUpdated} products`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
