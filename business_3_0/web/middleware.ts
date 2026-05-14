import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";
import { CACHE_API_PRIVATE } from "@/lib/http";

const PUBLIC_PATHS = new Set(["/login"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = isValidSessionToken(token);

  if (pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth/logout")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (!authed) {
      return NextResponse.json(
        { error: "unauthorized" },
        {
          status: 401,
          headers: { "Cache-Control": CACHE_API_PRIVATE },
        }
      );
    }
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.has(pathname)) {
    if (authed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|sw\\.js|manifest\\.webmanifest|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
