"use client";

import { createBrowserClient } from "@supabase/ssr";

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

let cached: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser Supabase client. Singleton — the SSR helper handles cookie sync
 * across server / browser, so we shouldn't spin up a fresh client per render.
 */
export function getSupabaseBrowser() {
  if (!cached) cached = createBrowserClient(url, anon);
  return cached;
}
