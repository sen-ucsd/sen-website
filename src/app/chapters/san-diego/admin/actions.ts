"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_USERS,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
} from "@/lib/admin-auth";

const ADMIN_BASE = "/chapters/san-diego/admin";

function safeNext(input: unknown): string {
  const s = typeof input === "string" ? input : "";
  // Only allow paths within the admin namespace; reject anything weird
  if (!s.startsWith(ADMIN_BASE)) return ADMIN_BASE;
  // Strip control characters and quotes that would be invalid in headers
  if (/[\r\n\0"<>]/.test(s)) return ADMIN_BASE;
  return s;
}

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  // Whitelist usernames so we never write a strange value into the cookie.
  if (!Object.prototype.hasOwnProperty.call(ADMIN_USERS, username)) {
    return { error: "Invalid username or password." };
  }
  if (ADMIN_USERS[username] !== password) {
    return { error: "Invalid username or password." };
  }

  const c = await cookies();
  c.set({
    name: ADMIN_COOKIE_NAME,
    value: username,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  redirect(next);
}

export async function logoutAction() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE_NAME);
  redirect(`${ADMIN_BASE}/login`);
}

export async function getCurrentAdmin(): Promise<string | null> {
  const c = await cookies();
  const v = c.get(ADMIN_COOKIE_NAME)?.value;
  if (!v || !Object.prototype.hasOwnProperty.call(ADMIN_USERS, v)) return null;
  return v;
}
