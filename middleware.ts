import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_NAME } from '@/lib/constants';
import { verifyJwtEdge } from './lib/auth/jwt-edge';
import { Role } from '@prisma/client/edge';

const protectedRoutes: { path: string; roles: Role[] }[] = [
  { path: '/admin', roles: [Role.ADMIN] },
  { path: '/dashboard', roles: [Role.CUSTOMER, Role.EXECUTOR, Role.ADMIN] },
  { path: '/orders', roles: [Role.EXECUTOR] },
];

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const matched = protectedRoutes.find(route => pathname.startsWith(route.path));
  if (!matched) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ACCESS_TOKEN_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const user = await verifyJwtEdge(token);

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (!matched.roles.includes(user.role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/orders/:path*'],
};
