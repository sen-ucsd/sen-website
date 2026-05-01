"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_USERS,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
} from "@/lib/admin-auth";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/chapters/san-diego/admin");

  const expected = ADMIN_USERS[username];
  if (!expected || expected !== password) {
    return { error: "Invalid username or password." };
  }

  const c = await cookies();
  c.set(ADMIN_COOKIE_NAME, username, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  redirect(next.startsWith("/chapters/san-diego/admin") ? next : "/chapters/san-diego/admin");
}

export async function logoutAction() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE_NAME);
  redirect("/chapters/san-diego/admin/login");
}

export async function getCurrentAdmin(): Promise<string | null> {
  const c = await cookies();
  return c.get(ADMIN_COOKIE_NAME)?.value ?? null;
}
