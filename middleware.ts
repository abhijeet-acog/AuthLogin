import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-min-32-chars-long!!!'
);

async function getSessionFromCookie(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) return null;

    const verified = await jwtVerify(token, secret);
    return verified.payload as { userId: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const session = await getSessionFromCookie(request);
  const isAuthPage = request.nextUrl.pathname === '/';

  if (isAuthPage) {
    if (session?.userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!session?.userId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*']
};