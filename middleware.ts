import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Use NextAuth's helper to get the token from its default cookies
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Define your public pages (e.g. your sign-in page)
  const publicPaths = ['/', '/test5']; // adjust these paths as needed

  if (publicPaths.includes(pathname)) {
    if (token) {
      console.log('Authenticated user, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // For protected routes, if no token, redirect to sign-in
  if (!token) {
    console.log('No token found, redirecting to sign-in');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*']
};
