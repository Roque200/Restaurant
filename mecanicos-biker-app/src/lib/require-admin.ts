import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidSessionValue } from "@/lib/admin-session";

export class UnauthorizedError extends Error {
  constructor() {
    super("No autorizado.");
  }
}

/** Llamar al inicio de cualquier server action que solo el panel admin debe poder ejecutar. */
export async function requireAdmin() {
  const store = await cookies();
  const value = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionValue(value)) {
    throw new UnauthorizedError();
  }
}
