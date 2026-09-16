import { listCustomers, listRewardItems } from "@/lib/db";
import { ClientesClient } from "./clientes-client";

export const dynamic = "force-dynamic";

export default function AdminClientesPage() {
  const customers = listCustomers();
  const rewardItems = listRewardItems();
  return <ClientesClient customers={customers} rewardItems={rewardItems} />;
}
