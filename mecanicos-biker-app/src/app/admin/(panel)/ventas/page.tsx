import { listProducts, listOrders } from "@/lib/db";
import { VentasClient } from "./ventas-client";

export const dynamic = "force-dynamic";

export default function AdminVentasPage() {
  const products = listProducts();
  const recentSales = listOrders()
    .filter((o) => o.paymentMethod === "mostrador")
    .slice(0, 20);
  return <VentasClient products={products} initialSales={recentSales} />;
}
