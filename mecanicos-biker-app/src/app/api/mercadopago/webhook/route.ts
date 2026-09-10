import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { markOrderPaid } from "@/lib/db";
import { fetchPayment, mercadoPagoEnabled } from "@/lib/mercadopago";

/**
 * Mercado Pago calls this URL after a payment event (Checkout Pro webhook).
 * It sends either `?type=payment&data.id=<id>` as query params or the same
 * shape in the JSON body, depending on the notification version — we accept both.
 */
export async function POST(request: NextRequest) {
  if (!mercadoPagoEnabled()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const topic = url.searchParams.get("type") ?? url.searchParams.get("topic");

  if (!paymentId) {
    try {
      const body = await request.json();
      paymentId = body?.data?.id ?? body?.id ?? null;
    } catch {
      /* no JSON body */
    }
  }

  if ((topic && topic !== "payment") || !paymentId) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const payment = await fetchPayment(String(paymentId));
    // We set external_reference = order.id when the preference was created,
    // so the payment always carries our order id back to us directly.
    const orderId = payment.external_reference;

    if (payment.status === "approved" && orderId) {
      const updated = markOrderPaid(orderId, String(payment.id));
      if (updated) {
        revalidatePath("/admin/pedidos");
        revalidatePath("/admin/dashboard");
      }
    }
  } catch (err) {
    console.error("mercadopago webhook error", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  return NextResponse.json({ ok: true });
}
