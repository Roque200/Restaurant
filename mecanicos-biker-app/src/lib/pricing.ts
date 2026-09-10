export type OrderItem = { name: string; price: number; qty: number };

export function orderTotal(order: { items: OrderItem[] }) {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
