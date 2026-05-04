import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

/**
 * Server-side Supabase client bound to the request's cookie store. Use this in
 * Server Components, Server Actions, and Route Handlers — anywhere we need to
 * read the current session from cookies and refresh it back when it rotates.
 */
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll throws when called from a Server Component; the middleware
          // refreshes sessions, so we can ignore here.
        }
      },
    },
  });
}

/** Convenience: returns the current authenticated user, or null. */
export async function getCurrentUser() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
