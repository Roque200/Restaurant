import { listOrders } from "@/lib/db";
import { PedidosClient } from "./pedidos-client";

export const dynamic = "force-dynamic";

export default function AdminPedidosPage() {
  const orders = listOrders();
  return <PedidosClient initialOrders={orders} />;
}
