import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import type { Order } from "./db";

export function mercadoPagoEnabled() {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

function client() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new Error("MERCADOPAGO_ACCESS_TOKEN no está configurado.");
  return new MercadoPagoConfig({ accessToken });
}

export async function createOrderPreference(order: Order, baseUrl: string) {
  const preference = new Preference(client());
  const result = await preference.create({
    body: {
      external_reference: order.id,
      items: order.items.map((item) => ({
        id: item.name,
        title: item.name,
        quantity: item.qty,
        unit_price: item.price,
        currency_id: "MXN",
      })),
      payer: { name: order.customer },
      back_urls: {
        success: `${baseUrl}/pedido/${order.id}`,
        pending: `${baseUrl}/pedido/${order.id}`,
        failure: `${baseUrl}/pedido/${order.id}`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/mercadopago/webhook`,
    },
  });
  return result;
}

export async function fetchPayment(paymentId: string) {
  const payment = new Payment(client());
  return payment.get({ id: paymentId });
}
