import { listProducts } from "@/lib/db";
import { ProductosClient } from "./productos-client";

export const dynamic = "force-dynamic";

export default function AdminProductosPage() {
  const products = listProducts();
  return <ProductosClient initialProducts={products} />;
}
