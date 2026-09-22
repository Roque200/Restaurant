"use server";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, checkAdminCredentials, createSessionCookieValue } from "@/lib/admin-session";

export async function loginAdmin(username: string, password: string) {
  if (!checkAdminCredentials(username, password)) {
    return { ok: false as const, error: "Usuario o contraseña incorrectos." };
  }
  const { value, maxAgeSeconds } = createSessionCookieValue();
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
  return { ok: true as const };
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}
