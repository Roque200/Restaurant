"use client";

/**
 * DEMO-ONLY client-side gate. There is no backend in this project, so this
 * just stores a flag in localStorage after checking a hardcoded credential.
 * It keeps someone from stumbling into /admin by accident, but it is NOT
 * real authentication — anyone can bypass it via devtools. Replace with a
 * real auth provider (session cookies validated server-side) before this
 * ever handles real customer or business data.
 */
const AUTH_KEY = "mecanicosBikerAdminAuth";
const DEMO_USER = "admin";
const DEMO_PASS = "biker2026";

export function checkDemoCredentials(user: string, pass: string) {
  return user.trim().toLowerCase() === DEMO_USER && pass === DEMO_PASS;
}

export function setAdminSession() {
  try {
    window.localStorage.setItem(AUTH_KEY, "true");
  } catch {
    /* ignore */
  }
}

export function clearAdminSession() {
  try {
    window.localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}

export function hasAdminSession() {
  try {
    return window.localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}
