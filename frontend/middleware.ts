import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  // RSC/prefetch requests in production often omit cookies; skip auth checks.
  if (
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("rsc") === "1"
  ) {
    return NextResponse.next();
  }

  const sessionToken = getSessionCookie(request.headers);

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  if (!sessionToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
