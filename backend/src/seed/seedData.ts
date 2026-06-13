import type { Business, Inquiry, Product, User, UserStatus } from '@adulis/shared';

/** Demo quick-switch profiles removed — use real accounts or seed sellers below. */
export const REMOVED_LEGACY_SEED_USER_IDS = [
  'user-buyer-1',
  'user-seller-1',
  'user-seller-2',
  'user-seller-3',
  'user-admin-1',
];

/** Default admin password when ADMIN_SEED_PASSWORD is not set. Change in production. */
export const DEFAULT_ADMIN_SEED_PASSWORD = 'NehnaX-Admin-2026!';

export const seedUsers: Array<User & { passwordPlain: string; seedStatus?: UserStatus }> = [
  {
    id: 'user-admin-nehnax',
    name: 'NehnaX Administrator',
    email: 'admin@nehnax.app',
    phone: '+256700000001',
    role: 'admin',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    passwordPlain: DEFAULT_ADMIN_SEED_PASSWORD,
  },
  {
    id: 'user-seed-seller-1',
    name: 'Daniel Mebrahtu',
    email: 'seed-restaurant@nehnax.app',
    phone: '+256755432109',
    role: 'seller',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    passwordPlain: 'Seed-Seller-2026!',
  },
  {
    id: 'user-seed-seller-2',
    name: 'Sara Mohammed',
    email: 'seed-grocery@nehnax.app',
    phone: '+256772987654',
    role: 'seller',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    passwordPlain: 'Seed-Seller-2026!',
  },
  {
    id: 'user-seed-seller-3',
    name: 'Hana Issa',
    email: 'seed-fashion@nehnax.app',
    phone: '+256701555444',
    role: 'seller',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    passwordPlain: 'Seed-Seller-2026!',
  },
  {
    id: 'user-pending-1',
    name: 'Helen Mehari',
    email: 'helen.pending@nehnax.app',
    phone: '+256700111222',
    role: 'customer',
    avatarUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150',
    passwordPlain: 'Seed-Pending-2026!',
    seedStatus: 'pending',
  },
  {
    id: 'user-pending-2',
    name: 'Robel Habte',
    email: 'robel.pending@nehnax.app',
    phone: '+256700333444',
    role: 'seller',
    avatarUrl:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150',
    passwordPlain: 'Seed-Pending-2026!',
    seedStatus: 'pending',
  },
];

export const seedBusinesses: Business[] = [
  {
    id: 'biz-1',
    ownerId: 'user-seed-seller-1',
    name: 'Adulis Authentic Habesha Restaurant',
    ownerName: 'Daniel Mebrahtu',
    description:
      'The home of premium traditional Eritrean cuisine in Kansanga. We prepare healthy recipes including fresh sourdough Injera, Zigni, Shiro, and hand-roasted organic coffee. Visited and loved by the Eritrean student community.',
    category: 'Food',
    address: 'Kansanga Stage, Ggaba Road, opposite Kampala International University (KIU)',
    neighborhood: 'Kansanga',
    phone: '+256755432109',
    whatsAppNumber: '256755432109',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200',
    coverImage:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    status: 'approved',
    package: 'top_featured',
    mapsUrl: 'https://maps.google.com/?q=-0.2974,32.6023',
    features: ['Cozy seating', 'Takeaway delivery', 'Traditional coffee ceremony', 'Student discounts'],
    createdAt: '2026-05-01',
  },
  {
    id: 'biz-2',
    ownerId: 'user-seed-seller-2',
    name: 'Asmara Spice & Grain Minimarket',
    ownerName: 'Sara Mohammed',
    description:
      'Your absolute choice for high-quality spices imported straight from Asmara. We source raw spice components: authentic Berbere, Shiro powder, Ge\'ez incense, traditional dry bread, clay coffee pots (Jebena), and raw green coffee beans.',
    category: 'Groceries',
    address: 'Kabalagala-Bunga Branch, near Soya Stage',
    neighborhood: 'Soya',
    phone: '+256772987654',
    whatsAppNumber: '256772987654',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200',
    coverImage:
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
    status: 'approved',
    package: 'featured',
    mapsUrl: 'https://maps.google.com/?q=-0.2855,32.6092',
    features: ['Imported items', 'Bulk spice packets', 'Authentic Jebena suppliers', 'Nehna ordering'],
    createdAt: '2026-05-15',
  },
  {
    id: 'biz-3',
    ownerId: 'user-seed-seller-3',
    name: 'Saba Traditional Bridal & Wear',
    ownerName: 'Hana Issa',
    description:
      'Handcrafted authentic Eritrean Zuria dresses, tailored cotton wear, bridal shawls, and premium community fashion accessories. Made by skilled Habesha tailors using pure cotton fabrics directly imported.',
    category: 'Fashion',
    address: 'Buziga Hill Road, opposite Buziga Church Stage',
    neighborhood: 'Buziga',
    phone: '+256701555444',
    whatsAppNumber: '256701555444',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200',
    coverImage:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    status: 'approved',
    package: 'premium',
    mapsUrl: 'https://maps.google.com/?q=-0.2790,32.6175',
    features: [
      'Custom tailoring',
      'Bridal party packages',
      'Traditional gold jewelry rentals',
      'Kids size available',
    ],
    createdAt: '2026-06-01',
  },
  {
    id: 'biz-4',
    ownerId: 'user-seed-seller-1',
    name: 'Ggaba Road Student Hostel Apartments',
    ownerName: 'Samuel G.',
    description:
      'Sizable one-bedroom and studio flat rooms highly recommended and rented by East African students in Kampala. Secure perimeter wall, stable water flow, fast Wi-Fi grid access, and neat quiet neighborhood environment.',
    category: 'Housing',
    address: 'Konge Stage, near Kansanga border lanes',
    neighborhood: 'Konge',
    phone: '+256788111222',
    whatsAppNumber: '256788111222',
    logo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=200',
    coverImage:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    status: 'pending',
    package: 'basic',
    mapsUrl: 'https://maps.google.com/?q=-0.2911,32.5999',
    features: ['24/7 Gate Guard', 'Water tank backup', 'Prepaid electricity meter', 'Near KIU University'],
    createdAt: '2026-06-10',
  },
  {
    id: 'biz-5',
    ownerId: 'user-seed-seller-2',
    name: 'Asmara Unisex Salon & Spa Barbers',
    ownerName: 'Sara Mohammed',
    description:
      'Professional Barbering, custom styling, hair texturizing, bridal makeup, and traditional massage. Experience high-end hospitality with relaxing Eritrean tea during your wait.',
    category: 'Beauty',
    address: 'Kabalagala Trading Centre, Opposite Equity Bank',
    neighborhood: 'Kabalagala',
    phone: '+256772987654',
    whatsAppNumber: '256772987654',
    logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200',
    coverImage:
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800',
    status: 'approved',
    package: 'premium',
    mapsUrl: 'https://maps.google.com/?q=-0.2981,32.5955',
    features: ['Top barbers', 'Hot towel massage', 'Traditional tea', 'Walk-ins welcome'],
    createdAt: '2026-05-20',
  },
  {
    id: 'biz-6',
    ownerId: 'user-seed-seller-1',
    name: 'Adulis Express Errands & Logistics',
    ownerName: 'Daniel Mebrahtu',
    description:
      'Reliable town deliveries, student luggage moves, airport pickups from Entebbe, and business parcel handlings around Kansanga, Kabalagala, Bunga, and Kampala city center.',
    category: 'Services',
    address: 'Bunga Trading Centre, near post office lane',
    neighborhood: 'Bunga',
    phone: '+256755432109',
    whatsAppNumber: '256755432109',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=200',
    coverImage:
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800',
    status: 'approved',
    package: 'basic',
    features: ['Prompt service', 'Entebbe runs', 'Eritrean driver', 'Affordable rates'],
    createdAt: '2026-05-25',
  },
];

export const seedProducts: Product[] = [
  {
    id: 'prod-1',
    businessId: 'biz-1',
    name: 'Special Eritrean Clay Jebena Coffee (Ceremonial Set)',
    price: 15000,
    description:
      'Experience the complete traditional coffee ceremony. Features three rounds (Awol, Bereka, Dereja), fresh popcorn, and traditional frankincense incense for the ideal authentic atmosphere.',
    image:
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=400',
    category: 'Food',
    isAvailable: true,
    createdAt: '2026-05-01',
    isSponsored: true,
  },
  {
    id: 'prod-2',
    businessId: 'biz-1',
    name: 'Classic Injera with Beef Zigni & Shiro Combo',
    price: 25000,
    description:
      'Freshly steamed authentic teff-flour sourdough Injera, served with beef zigni (beef stew simmered in original Berbere spiced ghee), delicious buttery Shiro, lentils, and salad garnish. Serves 1-2 people.',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',
    category: 'Food',
    isAvailable: true,
    createdAt: '2026-05-02',
  },
  {
    id: 'prod-3',
    businessId: 'biz-2',
    name: 'Original Asmara Berbere Pepper Spice Mix (1kg packet)',
    price: 35000,
    description:
      'Finely ground premium chili, fenugreek, garlic, ginger, basil, and secret home spices imported directly from Eritrea. Excellent for cooking authentic Habesha stews and Zigni.',
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400',
    category: 'Groceries',
    isAvailable: true,
    createdAt: '2026-05-15',
    isSponsored: true,
  },
  {
    id: 'prod-4',
    businessId: 'biz-2',
    name: 'Handmade Silt Clay Coffee Pot (Authentic Jebena)',
    price: 45000,
    description:
      'Traditional Eritrean clay coffee makers, handcrafted in Gash Barka region and shipped to Uganda. Designed specifically for simmering coffee on charcoal.',
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400',
    category: 'Groceries',
    isAvailable: true,
    createdAt: '2026-05-18',
  },
  {
    id: 'prod-5',
    businessId: 'biz-3',
    name: 'Celestial Silk embroidery Habesha Zuria Bridal Dress',
    price: 450000,
    description:
      'Stunning handwoven Habesha Zuria dress in pristine white cotton with intricate gold and teal embroidery patterns on the collar, sleeves, and lower hem. Fits standard sizes, adjustable back.',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400',
    category: 'Fashion',
    isAvailable: true,
    createdAt: '2026-06-01',
    isSponsored: true,
  },
  {
    id: 'prod-6',
    businessId: 'biz-5',
    name: 'Premium Barber Cut & Hot Oil Scalp Treatment',
    price: 15000,
    description:
      'Expert hair trim, precision hair line outline, hot oil conditioning massage, and refreshing aftershave lotion. Complimentary spiced Habesha tea included during session.',
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400',
    category: 'Beauty',
    isAvailable: true,
    createdAt: '2026-06-03',
  },
  {
    id: 'prod-7',
    businessId: 'biz-4',
    name: 'Comfortable Studio Apartment Block Rental (KIU Area)',
    price: 550000,
    description:
      'A neat studio apartment with self-contained bathroom, separate kitchenette counter, prepaid power check (yaka), secure water layout on 1st level. 5 minutes walk from Kansanga central traffic lane.',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
    category: 'Housing',
    isAvailable: true,
    createdAt: '2026-06-10',
  },
  {
    id: 'prod-8',
    businessId: 'biz-2',
    name: 'Traditional Eritrean Shiro Sift Powder (500g bag)',
    price: 12000,
    description:
      'Prepared powder made of ground high-quality chickpeas, split peas, red pepper flavor, onions, cardamom, and garlic. Simple and fast cooking.',
    image:
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=400',
    category: 'Groceries',
    isAvailable: false,
    createdAt: '2026-05-22',
  },
];

export const seedInquiries: Inquiry[] = [
  {
    id: 'inq-1',
    productId: 'prod-4',
    businessId: 'biz-2',
    buyerName: 'Meron Goitom',
    buyerPhone: '+256708123456',
    message:
      'Is the handmade clay coffee Jebena available? I would like to purchase it today near Kansanga Stage.',
    createdAt: '2026-06-10 14:35',
    status: 'unread',
  },
  {
    id: 'inq-2',
    productId: 'prod-5',
    businessId: 'biz-3',
    buyerName: 'Meron Goitom',
    buyerPhone: '+256755102030',
    message: 'Hello, is the celestial silk bridal dress adjustable? Can I fit it tomorrow?',
    createdAt: '2026-06-11 09:12',
    status: 'unread',
  },
];