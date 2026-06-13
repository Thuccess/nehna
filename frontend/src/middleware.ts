import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adulis_token')?.value;

  if (!token) {
    const isSellerRoute = request.nextUrl.pathname.startsWith('/seller');
    const loginPath = isSellerRoute ? '/login/seller' : '/login/buyer';
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/seller/:path*', '/admin/:path*'],
};
