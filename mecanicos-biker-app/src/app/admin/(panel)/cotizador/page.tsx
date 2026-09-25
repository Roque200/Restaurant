import { listProducts } from "@/lib/db";
import { CotizadorClient } from "./cotizador-client";

export const dynamic = "force-dynamic";

export default function AdminCotizadorPage() {
  const products = listProducts();
  return <CotizadorClient products={products} />;
}
