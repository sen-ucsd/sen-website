import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

const ADMIN_BASE = "/chapters/san-diego/admin";
const LOGIN_PATH = `${ADMIN_BASE}/login`;

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only guard pages under the admin namespace
  if (!path.startsWith(ADMIN_BASE)) return NextResponse.next();

  const isLoggedIn = !!req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  // Already on /login: if logged in, bounce to dashboard
  if (path === LOGIN_PATH) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(ADMIN_BASE, req.url));
    }
    return NextResponse.next();
  }

  // Any other admin route: require login
  if (!isLoggedIn) {
    const url = new URL(LOGIN_PATH, req.url);
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chapters/san-diego/admin/:path*"],
};
