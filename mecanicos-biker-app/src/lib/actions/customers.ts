"use server";

import { revalidatePath } from "next/cache";
import { redeemReward as dbRedeemReward, NotEnoughPointsError } from "@/lib/db";

export async function redeemReward(customerId: string) {
  try {
    const customer = dbRedeemReward(customerId);
    revalidatePath("/admin/clientes");
    return { ok: true as const, customer };
  } catch (err) {
    if (err instanceof NotEnoughPointsError) {
      return { ok: false as const, error: err.message };
    }
    throw err;
  }
}
