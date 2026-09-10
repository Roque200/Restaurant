export const WHATSAPP_NUMBER = "524612315670";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString("es-MX")} MXN`;
}
