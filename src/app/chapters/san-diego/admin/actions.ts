"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";

const ADMIN_BASE = "/chapters/san-diego/admin";

/** Display-name + email for the current authenticated admin, or null. */
export async function getCurrentAdmin(): Promise<{
  id: string;
  email: string;
  displayName: string;
} | null> {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    // The trigger guarantees a profile row, but fall back to the email local
    // part if for some reason it isn't there yet (replicas, etc.).
    displayName:
      profile?.display_name ?? user.email?.split("@")[0] ?? "Unknown",
  };
}

export async function logoutAction() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  redirect(`${ADMIN_BASE}/login`);
}
