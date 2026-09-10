"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct as dbCreateProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
  type Product,
} from "@/lib/db";

function revalidateProductRoutes() {
  revalidatePath("/admin/productos");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function createProduct(input: Omit<Product, "id">) {
  const product = dbCreateProduct(input);
  revalidateProductRoutes();
  return product;
}

export async function updateProduct(id: string, input: Omit<Product, "id">) {
  dbUpdateProduct(id, input);
  revalidateProductRoutes();
}

export async function deleteProduct(id: string) {
  dbDeleteProduct(id);
  revalidateProductRoutes();
}
