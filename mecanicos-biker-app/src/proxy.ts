import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionValue } from "@/lib/admin-session";

// Corre en Node.js (default en Next 16) antes de que se genere CUALQUIER
// respuesta para /admin/**, incluida la carga de datos de los Server
// Components (citas, pedidos, clientes). Así una petición sin sesión válida
// nunca llega a ejecutar listCustomers()/listOrders()/etc — se corta aquí.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionValue(session)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
