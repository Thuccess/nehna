import type {
  AuthResponse,
  Business,
  BusinessCreateResponse,
  BusinessOnboardingInput,
  BusinessUpdate,
  Favorite,
  FavoriteInput,
  Inquiry,
  InquiryInput,
  Order,
  OrderInput,
  OrderMessage,
  OrderMessageInput,
  OrderStatusUpdate,
  PresignInput,
  PresignResponse,
  Product,
  ProductInput,
  ProductUpdate,
  RegisterInput,
  SellerRegisterInput,
  SellerRegisterResponse,
  LoginInput,
  UpdateUserInput,
  User,
} from '@adulis/shared';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(path: string, query?: FetchOptions['query']): string {
  const url = new URL(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, token, query, headers, ...rest } = options;
  const url = buildUrl(path, query);

  const res = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      typeof payload === 'object' && payload && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
}

export const api = {
  // Auth
  register: (input: RegisterInput) =>
    apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: input }),
  registerSeller: (input: SellerRegisterInput) =>
    apiFetch<SellerRegisterResponse>('/auth/register/seller', { method: 'POST', body: input }),
  login: (input: LoginInput) =>
    apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: input }),
  forgotPassword: (email: string) =>
    apiFetch<{ ok: true }>('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token: string, password: string) =>
    apiFetch<{ ok: true }>('/auth/reset-password', {
      method: 'POST',
      body: { token, password },
    }),
  logout: () => apiFetch<{ ok: true }>('/auth/logout', { method: 'POST' }),
  me: (token?: string | null) => apiFetch<{ user: User }>('/auth/me', { token }),
  updateMe: (input: { name?: string; phone?: string; avatarUrl?: string }) =>
    apiFetch<{ user: User }>('/auth/me', { method: 'PATCH', body: input }),

  // Businesses
  listBusinesses: (query?: {
    category?: string;
    neighborhood?: string;
    status?: 'pending' | 'approved' | 'suspended' | 'all';
    ownerId?: string;
    q?: string;
    limit?: number;
  }) => apiFetch<{ businesses: Business[] }>('/businesses', { query }),
  getBusiness: (id: string) => apiFetch<{ business: Business }>(`/businesses/${id}`),
  createBusiness: (input: BusinessOnboardingInput) =>
    apiFetch<BusinessCreateResponse>('/businesses', { method: 'POST', body: input }),
  updateBusiness: (id: string, input: BusinessUpdate) =>
    apiFetch<{ business: Business }>(`/businesses/${id}`, { method: 'PATCH', body: input }),
  deleteBusiness: (id: string) =>
    apiFetch<{ ok: true }>(`/businesses/${id}`, { method: 'DELETE' }),
  approveBusiness: (id: string) =>
    apiFetch<{ business: Business }>(`/businesses/${id}/approve`, { method: 'POST' }),
  suspendBusiness: (id: string) =>
    apiFetch<{ business: Business }>(`/businesses/${id}/suspend`, { method: 'POST' }),

  // Products
  listProducts: (query?: {
    businessId?: string;
    category?: string;
    q?: string;
    available?: boolean;
    limit?: number;
  }) => apiFetch<{ products: Product[] }>('/products', { query }),
  getProduct: (id: string) => apiFetch<{ product: Product }>(`/products/${id}`),
  createProduct: (input: ProductInput) =>
    apiFetch<{ product: Product }>('/products', { method: 'POST', body: input }),
  updateProduct: (id: string, input: ProductUpdate) =>
    apiFetch<{ product: Product }>(`/products/${id}`, { method: 'PATCH', body: input }),
  deleteProduct: (id: string) => apiFetch<{ ok: true }>(`/products/${id}`, { method: 'DELETE' }),

  // Inquiries
  listInquiries: (query?: { mine?: boolean }) =>
    apiFetch<{ inquiries: Inquiry[] }>('/inquiries', {
      query: query?.mine ? { mine: '1' } : undefined,
    }),
  createInquiry: (input: InquiryInput) =>
    apiFetch<{ inquiry: Inquiry }>('/inquiries', { method: 'POST', body: input }),
  markInquiryRead: (id: string) =>
    apiFetch<{ inquiry: Inquiry }>(`/inquiries/${id}/read`, { method: 'PATCH' }),

  // Orders (Nehna platform commerce)
  listOrders: () => apiFetch<{ orders: Order[] }>('/orders'),
  getOrder: (id: string) => apiFetch<{ order: Order }>(`/orders/${id}`),
  createOrder: (input: OrderInput) =>
    apiFetch<{ order: Order }>('/orders', { method: 'POST', body: input }),
  updateOrderStatus: (id: string, input: OrderStatusUpdate) =>
    apiFetch<{ order: Order }>(`/orders/${id}/status`, { method: 'PATCH', body: input }),
  listOrderMessages: (orderId: string) =>
    apiFetch<{ messages: OrderMessage[] }>(`/orders/${orderId}/messages`),
  sendOrderMessage: (orderId: string, input: OrderMessageInput) =>
    apiFetch<{ message: OrderMessage }>(`/orders/${orderId}/messages`, {
      method: 'POST',
      body: input,
    }),

  // Favorites
  listFavorites: () => apiFetch<{ favorites: Favorite[] }>('/favorites'),
  addFavorite: (input: FavoriteInput) =>
    apiFetch<{ favorite: Favorite }>('/favorites', { method: 'POST', body: input }),
  removeFavorite: (itemType: 'business' | 'product', itemId: string) =>
    apiFetch<{ ok: true }>(`/favorites/${itemType}/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
    }),

  // Users (admin)
  listUsers: (query?: {
    role?: 'customer' | 'seller' | 'admin';
    status?: 'pending' | 'active' | 'banned';
    q?: string;
  }) => apiFetch<{ users: User[] }>('/users', { query }),
  updateUser: (id: string, input: UpdateUserInput) =>
    apiFetch<{ user: User }>(`/users/${id}`, { method: 'PATCH', body: input }),
  approveUser: (id: string) =>
    apiFetch<{ user: User }>(`/users/${id}/approve`, { method: 'POST' }),

  // Search
  search: (query: { q: string; type?: 'business' | 'product'; limit?: number }) =>
    apiFetch<
      | { type: 'business'; results: Business[] }
      | { type: 'product'; results: Product[] }
    >('/search', { query }),

  // Uploads
  presignUpload: (input: PresignInput) =>
    apiFetch<PresignResponse>('/uploads/presign', { method: 'POST', body: input }),
};
