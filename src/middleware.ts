import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight Edge-compatible middleware — checks for NextAuth session cookie
 * without importing next-auth (which pulls in @panva/hkdf, unavailable in Edge Runtime).
 * The actual auth validation still happens server-side in each API route.
 */
export function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/saved/:path*"],
};
