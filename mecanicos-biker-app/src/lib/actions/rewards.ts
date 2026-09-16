"use server";

import { revalidatePath } from "next/cache";
import {
  createRewardItem as dbCreateRewardItem,
  updateRewardItem as dbUpdateRewardItem,
  deleteRewardItem as dbDeleteRewardItem,
  redeemReward as dbRedeemReward,
  NotEnoughPointsError,
  RewardItemNotFoundError,
} from "@/lib/db";

export async function createRewardItem(input: { name: string; pointsCost: number }) {
  const item = dbCreateRewardItem(input);
  revalidatePath("/admin/clientes");
  return item;
}

export async function updateRewardItem(id: string, input: { name: string; pointsCost: number; active: boolean }) {
  dbUpdateRewardItem(id, input);
  revalidatePath("/admin/clientes");
}

export async function deleteRewardItem(id: string) {
  dbDeleteRewardItem(id);
  revalidatePath("/admin/clientes");
}

export async function redeemReward(customerId: string, rewardItemId: string) {
  try {
    const customer = dbRedeemReward(customerId, rewardItemId);
    revalidatePath("/admin/clientes");
    return { ok: true as const, customer };
  } catch (err) {
    if (err instanceof NotEnoughPointsError || err instanceof RewardItemNotFoundError) {
      return { ok: false as const, error: err.message };
    }
    throw err;
  }
}
