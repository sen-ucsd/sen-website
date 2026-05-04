import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_BASE = "/chapters/san-diego/admin";
const LOGIN_PATH = `${ADMIN_BASE}/login`;
const SIGNUP_PATH = `${ADMIN_BASE}/signup`;
const FORGOT_PATH = `${ADMIN_BASE}/forgot`;
const RESET_PATH = `${ADMIN_BASE}/reset`;

const PUBLIC_AUTH_PATHS = new Set<string>([
  LOGIN_PATH,
  SIGNUP_PATH,
  FORGOT_PATH,
  RESET_PATH,
]);

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Cheap exit for anything outside the admin namespace.
  if (!path.startsWith(ADMIN_BASE)) return NextResponse.next();

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: getUser() must run between the createServerClient call and
  // returning the response, so refreshed session cookies make it back.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const onAuthPage = PUBLIC_AUTH_PATHS.has(path);

  if (user && onAuthPage) {
    return NextResponse.redirect(new URL(ADMIN_BASE, request.url));
  }

  if (!user && !onAuthPage) {
    const redirect = new URL(LOGIN_PATH, request.url);
    if (path !== ADMIN_BASE) redirect.searchParams.set("from", path);
    return NextResponse.redirect(redirect);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/chapters/san-diego/admin/:path*"],
};
