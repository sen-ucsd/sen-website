import { createClient } from "@supabase/supabase-js";

// Trim defensively. Vercel env-var values occasionally pick up trailing
// whitespace or a newline depending on how they were entered, and that breaks
// the supabase client with: "Failed to execute 'set' on 'Headers': Invalid value".
const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

export const supabase = createClient(url, anon, {
  auth: { persistSession: false },
});
