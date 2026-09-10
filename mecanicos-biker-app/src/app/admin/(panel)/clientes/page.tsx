import { listCustomers } from "@/lib/db";
import { ClientesClient } from "./clientes-client";

export const dynamic = "force-dynamic";

export default function AdminClientesPage() {
  const customers = listCustomers();
  return <ClientesClient customers={customers} />;
}
