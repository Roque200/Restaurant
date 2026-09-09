export type AppointmentStatus = "pendiente" | "confirmada" | "en_proceso" | "completada" | "cancelada";
export type OrderStatus = "pendiente" | "pagado" | "entregado" | "cancelado";

export type Appointment = {
  id: string;
  customer: string;
  phone: string;
  service: string;
  date: string; // ISO yyyy-mm-dd
  hour: string; // "09:00"
  status: AppointmentStatus;
  notes?: string;
};

export type OrderItem = { name: string; qty: number; price: number };
export type Order = {
  id: string;
  customer: string;
  phone: string;
  items: OrderItem[];
  status: OrderStatus;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  category: "componentes" | "accesorios" | "cuidado" | "herramientas";
  price: number;
  stock: number;
  lowStockThreshold: number;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  visits: number;
  totalSpent: number;
  lastVisit: string;
};

export const APPOINTMENTS: Appointment[] = [
  { id: "C-1042", customer: "Javier Ramírez", phone: "461 100 2233", service: "Servicio de suspensión", date: "2026-09-10", hour: "09:00", status: "confirmada" },
  { id: "C-1043", customer: "Carla Mendoza", phone: "461 118 4455", service: "Afinación general", date: "2026-09-10", hour: "11:00", status: "pendiente" },
  { id: "C-1044", customer: "Diego Herrera", phone: "461 122 7788", service: "Frenos hidráulicos", date: "2026-09-10", hour: "13:00", status: "en_proceso" },
  { id: "C-1045", customer: "Laura Pineda", phone: "461 130 9911", service: "Transmisión", date: "2026-09-11", hour: "10:00", status: "confirmada" },
  { id: "C-1046", customer: "Mariana Ríos", phone: "461 144 2200", service: "Diagnóstico", date: "2026-09-11", hour: "15:00", status: "pendiente" },
  { id: "C-1047", customer: "Roberto Salas", phone: "461 155 3311", service: "Servicio de suspensión", date: "2026-09-09", hour: "12:00", status: "completada" },
  { id: "C-1048", customer: "Ana Torres", phone: "461 166 4422", service: "Afinación general", date: "2026-09-09", hour: "16:00", status: "cancelada" },
  { id: "C-1049", customer: "Luis Fernández", phone: "461 177 5533", service: "Frenos hidráulicos", date: "2026-09-08", hour: "09:00", status: "completada" },
];

export const ORDERS: Order[] = [
  {
    id: "P-3301",
    customer: "Javier Ramírez",
    phone: "461 100 2233",
    items: [{ name: "Casco MTB ProShield", qty: 1, price: 890 }],
    status: "pagado",
    date: "2026-09-09",
  },
  {
    id: "P-3302",
    customer: "Carla Mendoza",
    phone: "461 118 4455",
    items: [
      { name: "Cámara MTB 29\"", qty: 2, price: 180 },
      { name: "Lubricante de cadena (cera)", qty: 1, price: 220 },
    ],
    status: "pendiente",
    date: "2026-09-09",
  },
  {
    id: "P-3303",
    customer: "Diego Herrera",
    phone: "461 122 7788",
    items: [{ name: "Multiherramienta 16 en 1", qty: 1, price: 450 }],
    status: "entregado",
    date: "2026-09-08",
  },
  {
    id: "P-3304",
    customer: "Ana Torres",
    phone: "461 166 4422",
    items: [{ name: "Llanta Tubeless 29x2.3", qty: 2, price: 1190 }],
    status: "pagado",
    date: "2026-09-07",
  },
  {
    id: "P-3305",
    customer: "Roberto Salas",
    phone: "461 155 3311",
    items: [{ name: "Pastillas de freno semi-metálicas", qty: 1, price: 280 }],
    status: "cancelado",
    date: "2026-09-06",
  },
];

export const PRODUCTS: Product[] = [
  { id: "PR-01", name: "Casco MTB ProShield", category: "accesorios", price: 890, stock: 14, lowStockThreshold: 5 },
  { id: "PR-02", name: "Guantes ReinforceGrip", category: "accesorios", price: 350, stock: 22, lowStockThreshold: 8 },
  { id: "PR-03", name: "Cámara MTB 29\"", category: "componentes", price: 180, stock: 4, lowStockThreshold: 10 },
  { id: "PR-04", name: "Llanta Tubeless 29x2.3", category: "componentes", price: 1190, stock: 7, lowStockThreshold: 4 },
  { id: "PR-05", name: "Cadena 12 velocidades", category: "componentes", price: 650, stock: 11, lowStockThreshold: 5 },
  { id: "PR-06", name: "Pastillas de freno semi-metálicas", category: "componentes", price: 280, stock: 3, lowStockThreshold: 6 },
  { id: "PR-07", name: "Lubricante de cadena (cera)", category: "cuidado", price: 220, stock: 18, lowStockThreshold: 6 },
  { id: "PR-08", name: "Multiherramienta 16 en 1", category: "herramientas", price: 450, stock: 9, lowStockThreshold: 5 },
];

export const CUSTOMERS: Customer[] = [
  { id: "CL-01", name: "Javier Ramírez", phone: "461 100 2233", email: "javier.ramirez@mail.com", visits: 6, totalSpent: 5420, lastVisit: "2026-09-09" },
  { id: "CL-02", name: "Carla Mendoza", phone: "461 118 4455", email: "carla.m@mail.com", visits: 3, totalSpent: 2180, lastVisit: "2026-09-09" },
  { id: "CL-03", name: "Diego Herrera", phone: "461 122 7788", visits: 9, totalSpent: 8950, lastVisit: "2026-09-08" },
  { id: "CL-04", name: "Laura Pineda", phone: "461 130 9911", email: "laura.pineda@mail.com", visits: 1, totalSpent: 890, lastVisit: "2026-09-11" },
  { id: "CL-05", name: "Mariana Ríos", phone: "461 144 2200", visits: 4, totalSpent: 3100, lastVisit: "2026-09-11" },
  { id: "CL-06", name: "Roberto Salas", phone: "461 155 3311", email: "r.salas@mail.com", visits: 12, totalSpent: 14200, lastVisit: "2026-09-06" },
  { id: "CL-07", name: "Ana Torres", phone: "461 166 4422", visits: 2, totalSpent: 2680, lastVisit: "2026-09-07" },
];

/** Últimos 14 días de ingresos combinados (servicio + tienda), para la gráfica del dashboard. */
export const REVENUE_TREND = [
  4200, 3800, 5100, 4600, 6200, 7100, 5300, 4800, 6600, 7400, 8100, 6900, 7600, 8900,
];

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  en_proceso: "En proceso",
  completada: "Completada",
  cancelada: "Cancelada",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const CATEGORY_LABEL: Record<Product["category"], string> = {
  componentes: "Componentes",
  accesorios: "Accesorios",
  cuidado: "Cuidado",
  herramientas: "Herramientas",
};

export function orderTotal(order: Order) {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
