// Verificación de sesión de administrador — funciones puras (sin next/headers,
// sin NextRequest) para que las pueda usar tanto proxy.ts (Node runtime) como
// los server actions. La contraseña NUNCA se manda al navegador: solo vive
// aquí, en el servidor, comparada con crypto.timingSafeEqual para no filtrar
// su longitud/contenido por temporización.
import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "mb_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 horas

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // Solo para desarrollo local: en producción define ADMIN_SESSION_SECRET
    // (una cadena aleatoria larga) en tu .env — ver .env.example.
    return "dev-only-insecure-secret-change-me";
  }
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    // Igual comparamos algo del mismo tamaño que "a" para no filtrar la
    // longitud de "b" a través del tiempo que tarda en responder.
    crypto.timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function checkAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "biker2026";
  const userOk = timingSafeEqual(username.trim().toLowerCase(), expectedUser.toLowerCase());
  const passOk = timingSafeEqual(password, expectedPass);
  return userOk && passOk;
}

/** Cookie firmada: "admin.<expira_ms>.<firma>" — no hay estado en el servidor que limpiar. */
export function createSessionCookieValue(): { value: string; maxAgeSeconds: number } {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  const value = `${payload}.${sign(payload)}`;
  return { value, maxAgeSeconds: SESSION_MAX_AGE_SECONDS };
}

export function isValidSessionValue(value: string | undefined | null): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [kind, expiresAtRaw, signature] = parts;
  if (kind !== "admin") return false;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  const expectedSignature = sign(`${kind}.${expiresAtRaw}`);
  return timingSafeEqual(signature, expectedSignature);
}
