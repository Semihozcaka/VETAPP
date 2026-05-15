import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth cookie'yi al
  const supabaseAccessToken = request.cookies.get('sb-access-token')?.value;

  // Public routes
  const publicRoutes = ['/login', '/register', '/join'];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Protected routes
  const protectedRoutes = ['/super-admin', '/clinic', '/pet-owner'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Eğer token yoksa ve protected route ise login'e yönlendir
  if (!supabaseAccessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Eğer token varsa ve public route ise dashboard'a yönlendir
  if (supabaseAccessToken && isPublicRoute) {
    // TODO: User role'ü kontrol edip uygun dashboard'a yönlendir
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Middleware'ı her route'a uygulamak için:
     * - _next/static ile başlayanları hariç tut
     * - _next/image ile başlayanları hariç tut
     * - favicon.ico'yu hariç tut
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
