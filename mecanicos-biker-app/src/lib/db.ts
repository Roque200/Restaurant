import Database from "better-sqlite3";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";

export type AppointmentStatus = "pendiente" | "confirmada" | "en_proceso" | "completada" | "cancelada";
export type OrderStatus = "pendiente" | "pagado" | "entregado" | "cancelado";
export type PaymentMethod = "whatsapp" | "mercadopago";
export type ProductCategory = "componentes" | "accesorios" | "cuidado" | "herramientas";

export type Appointment = {
  id: string;
  qrToken: string;
  customer: string;
  phone: string;
  service: string;
  date: string;
  hour: string;
  status: AppointmentStatus;
  checkedInAt: string | null;
  notes: string | null;
};

export type OrderItem = { name: string; price: number; qty: number };
export type Order = {
  id: string;
  customer: string;
  phone: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  mpPaymentId: string | null;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  visits: number;
  totalSpent: number;
  lastVisit: string;
};

// Next.js hot-reloads modules in dev, which would otherwise reopen the file
// and re-run seeding on every edit — stash the connection on globalThis.
declare global {
  var __mecanicosDb: Database.Database | undefined;
}

function openDb() {
  const dbPath = path.join(process.cwd(), "data", "mecanicos-biker.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  seedIfEmpty(db);
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS counters (
      name TEXT PRIMARY KEY,
      value INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      low_stock_threshold INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      email TEXT,
      visits INTEGER NOT NULL DEFAULT 0,
      total_spent INTEGER NOT NULL DEFAULT 0,
      last_visit TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      qr_token TEXT NOT NULL UNIQUE,
      customer TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL,
      date TEXT NOT NULL,
      hour TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pendiente',
      checked_in_at TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_slot
      ON appointments(date, hour)
      WHERE status != 'cancelada';

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer TEXT NOT NULL,
      phone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pendiente',
      payment_method TEXT NOT NULL DEFAULT 'whatsapp',
      mp_preference_id TEXT,
      mp_payment_id TEXT,
      date TEXT NOT NULL DEFAULT (date('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL REFERENCES orders(id),
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      qty INTEGER NOT NULL
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  const { n } = db.prepare("SELECT COUNT(*) as n FROM products").get() as { n: number };
  if (n > 0) return;

  const insertProduct = db.prepare(
    "INSERT INTO products (id, name, category, description, price, stock, low_stock_threshold) VALUES (@id, @name, @category, @description, @price, @stock, @lowStockThreshold)",
  );
  const insertCustomer = db.prepare(
    "INSERT INTO customers (id, name, phone, email, visits, total_spent, last_visit) VALUES (@id, @name, @phone, @email, @visits, @totalSpent, @lastVisit)",
  );
  const insertAppointment = db.prepare(
    "INSERT INTO appointments (id, qr_token, customer, phone, service, date, hour, status) VALUES (@id, @qrToken, @customer, @phone, @service, @date, @hour, @status)",
  );
  const insertOrder = db.prepare(
    "INSERT INTO orders (id, customer, phone, status, payment_method, date) VALUES (@id, @customer, @phone, @status, 'whatsapp', @date)",
  );
  const insertOrderItem = db.prepare(
    "INSERT INTO order_items (order_id, name, price, qty) VALUES (@orderId, @name, @price, @qty)",
  );
  const setCounter = db.prepare("INSERT OR REPLACE INTO counters (name, value) VALUES (?, ?)");

  const seed = db.transaction(() => {
    const products: Product[] = [
      { id: "PR-01", name: "Casco MTB ProShield", category: "accesorios", description: "Ajuste giratorio, ventilación de 18 puertos y certificación de impacto.", price: 890, stock: 14, lowStockThreshold: 5 },
      { id: "PR-02", name: "Guantes ReinforceGrip", category: "accesorios", description: "Palma reforzada anti-vibración, dedos táctiles para pantalla.", price: 350, stock: 22, lowStockThreshold: 8 },
      { id: "PR-03", name: "Cámara MTB 29\"", category: "componentes", description: "Butilo estándar, válvula Presta 48mm, compatible rodada 29.", price: 180, stock: 4, lowStockThreshold: 10 },
      { id: "PR-04", name: "Llanta Tubeless 29x2.3", category: "componentes", description: "Compuesto de baja resistencia a la rodadura, refuerzo anti-ponchaduras.", price: 1190, stock: 7, lowStockThreshold: 4 },
      { id: "PR-05", name: "Cadena 12 velocidades", category: "componentes", description: "Recubrimiento anticorrosivo, compatible con la mayoría de grupos 12V.", price: 650, stock: 11, lowStockThreshold: 5 },
      { id: "PR-06", name: "Pastillas de freno semi-metálicas", category: "componentes", description: "Mayor mordida en mojado, compatibles con las principales marcas.", price: 280, stock: 3, lowStockThreshold: 6 },
      { id: "PR-07", name: "Lubricante de cadena (cera)", category: "cuidado", description: "Fórmula en cera de baja adherencia al polvo, para clima seco y mixto.", price: 220, stock: 18, lowStockThreshold: 6 },
      { id: "PR-08", name: "Multiherramienta 16 en 1", category: "herramientas", description: "Llaves Allen, desarmadores y desmontallantas en un solo cuerpo.", price: 450, stock: 9, lowStockThreshold: 5 },
    ];
    for (const p of products) insertProduct.run(p);

    const customers: Customer[] = [
      { id: "CL-01", name: "Javier Ramírez", phone: "461 100 2233", email: "javier.ramirez@mail.com", visits: 6, totalSpent: 5420, lastVisit: "2026-09-09" },
      { id: "CL-02", name: "Carla Mendoza", phone: "461 118 4455", email: "carla.m@mail.com", visits: 3, totalSpent: 2180, lastVisit: "2026-09-09" },
      { id: "CL-03", name: "Diego Herrera", phone: "461 122 7788", email: null, visits: 9, totalSpent: 8950, lastVisit: "2026-09-08" },
      { id: "CL-04", name: "Laura Pineda", phone: "461 130 9911", email: "laura.pineda@mail.com", visits: 1, totalSpent: 890, lastVisit: "2026-09-11" },
      { id: "CL-05", name: "Mariana Ríos", phone: "461 144 2200", email: null, visits: 4, totalSpent: 3100, lastVisit: "2026-09-11" },
      { id: "CL-06", name: "Roberto Salas", phone: "461 155 3311", email: "r.salas@mail.com", visits: 12, totalSpent: 14200, lastVisit: "2026-09-06" },
      { id: "CL-07", name: "Ana Torres", phone: "461 166 4422", email: null, visits: 2, totalSpent: 2680, lastVisit: "2026-09-07" },
    ];
    for (const c of customers) insertCustomer.run(c);

    const appointments: Omit<Appointment, "checkedInAt" | "notes">[] = [
      { id: "C-1042", qrToken: crypto.randomUUID(), customer: "Javier Ramírez", phone: "461 100 2233", service: "Servicio de suspensión", date: "2026-09-10", hour: "09:00", status: "confirmada" },
      { id: "C-1043", qrToken: crypto.randomUUID(), customer: "Carla Mendoza", phone: "461 118 4455", service: "Afinación general", date: "2026-09-10", hour: "11:00", status: "pendiente" },
      { id: "C-1044", qrToken: crypto.randomUUID(), customer: "Diego Herrera", phone: "461 122 7788", service: "Frenos hidráulicos", date: "2026-09-10", hour: "13:00", status: "en_proceso" },
      { id: "C-1045", qrToken: crypto.randomUUID(), customer: "Laura Pineda", phone: "461 130 9911", service: "Transmisión", date: "2026-09-11", hour: "10:00", status: "confirmada" },
      { id: "C-1046", qrToken: crypto.randomUUID(), customer: "Mariana Ríos", phone: "461 144 2200", service: "Diagnóstico", date: "2026-09-11", hour: "15:00", status: "pendiente" },
      { id: "C-1047", qrToken: crypto.randomUUID(), customer: "Roberto Salas", phone: "461 155 3311", service: "Servicio de suspensión", date: "2026-09-09", hour: "12:00", status: "completada" },
      { id: "C-1048", qrToken: crypto.randomUUID(), customer: "Ana Torres", phone: "461 166 4422", service: "Afinación general", date: "2026-09-09", hour: "16:00", status: "cancelada" },
      { id: "C-1049", qrToken: crypto.randomUUID(), customer: "Luis Fernández", phone: "461 177 5533", service: "Frenos hidráulicos", date: "2026-09-08", hour: "09:00", status: "completada" },
    ];
    for (const a of appointments) insertAppointment.run(a);

    const orders: { id: string; customer: string; phone: string; status: OrderStatus; date: string; items: OrderItem[] }[] = [
      { id: "P-3301", customer: "Javier Ramírez", phone: "461 100 2233", status: "pagado", date: "2026-09-09", items: [{ name: "Casco MTB ProShield", qty: 1, price: 890 }] },
      { id: "P-3302", customer: "Carla Mendoza", phone: "461 118 4455", status: "pendiente", date: "2026-09-09", items: [{ name: "Cámara MTB 29\"", qty: 2, price: 180 }, { name: "Lubricante de cadena (cera)", qty: 1, price: 220 }] },
      { id: "P-3303", customer: "Diego Herrera", phone: "461 122 7788", status: "entregado", date: "2026-09-08", items: [{ name: "Multiherramienta 16 en 1", qty: 1, price: 450 }] },
      { id: "P-3304", customer: "Ana Torres", phone: "461 166 4422", status: "pagado", date: "2026-09-07", items: [{ name: "Llanta Tubeless 29x2.3", qty: 2, price: 1190 }] },
      { id: "P-3305", customer: "Roberto Salas", phone: "461 155 3311", status: "cancelado", date: "2026-09-06", items: [{ name: "Pastillas de freno semi-metálicas", qty: 1, price: 280 }] },
    ];
    for (const o of orders) {
      insertOrder.run(o);
      for (const item of o.items) insertOrderItem.run({ orderId: o.id, ...item });
    }

    setCounter.run("appointments", 1049);
    setCounter.run("orders", 3305);
    setCounter.run("products", 8);
    setCounter.run("customers", 7);
  });

  seed();
}

export function getDb() {
  if (!globalThis.__mecanicosDb) {
    globalThis.__mecanicosDb = openDb();
  }
  return globalThis.__mecanicosDb;
}

function nextSeq(name: string, startAt: number) {
  const db = getDb();
  const row = db.prepare("SELECT value FROM counters WHERE name = ?").get(name) as { value: number } | undefined;
  const next = (row?.value ?? startAt) + 1;
  db.prepare("INSERT OR REPLACE INTO counters (name, value) VALUES (?, ?)").run(name, next);
  return next;
}

// ---------- Products ----------

function rowToProduct(row: {
  id: string; name: string; category: string; description: string; price: number; stock: number; low_stock_threshold: number;
}): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category as ProductCategory,
    description: row.description,
    price: row.price,
    stock: row.stock,
    lowStockThreshold: row.low_stock_threshold,
  };
}

export function listProducts(): Product[] {
  const rows = getDb().prepare("SELECT * FROM products ORDER BY name ASC").all();
  return (rows as Parameters<typeof rowToProduct>[0][]).map(rowToProduct);
}

export function getProduct(id: string): Product | null {
  const row = getDb().prepare("SELECT * FROM products WHERE id = ?").get(id);
  return row ? rowToProduct(row as Parameters<typeof rowToProduct>[0]) : null;
}

export function createProduct(input: Omit<Product, "id">): Product {
  const id = `PR-${String(nextSeq("products", 8)).padStart(2, "0")}`;
  getDb()
    .prepare(
      "INSERT INTO products (id, name, category, description, price, stock, low_stock_threshold) VALUES (@id, @name, @category, @description, @price, @stock, @lowStockThreshold)",
    )
    .run({ id, ...input });
  return { id, ...input };
}

export function updateProduct(id: string, input: Omit<Product, "id">) {
  getDb()
    .prepare(
      "UPDATE products SET name=@name, category=@category, description=@description, price=@price, stock=@stock, low_stock_threshold=@lowStockThreshold WHERE id=@id",
    )
    .run({ id, ...input });
}

export function deleteProduct(id: string) {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
}

// ---------- Customers ----------

function rowToCustomer(row: {
  id: string; name: string; phone: string; email: string | null; visits: number; total_spent: number; last_visit: string;
}): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    visits: row.visits,
    totalSpent: row.total_spent,
    lastVisit: row.last_visit,
  };
}

export function listCustomers(): Customer[] {
  const rows = getDb().prepare("SELECT * FROM customers ORDER BY total_spent DESC").all();
  return (rows as Parameters<typeof rowToCustomer>[0][]).map(rowToCustomer);
}

/** Finds a customer by phone, creating one if needed, and records a visit + spend. */
function touchCustomer(db: Database.Database, name: string, phone: string, spend: number, visitDate: string) {
  const existing = db.prepare("SELECT * FROM customers WHERE phone = ?").get(phone) as
    | { id: string; visits: number; total_spent: number }
    | undefined;
  if (existing) {
    db.prepare(
      "UPDATE customers SET visits = visits + 1, total_spent = total_spent + ?, last_visit = ?, name = ? WHERE id = ?",
    ).run(spend, visitDate, name, existing.id);
    return;
  }
  const id = `CL-${String(nextSeq("customers", 7)).padStart(2, "0")}`;
  db.prepare(
    "INSERT INTO customers (id, name, phone, email, visits, total_spent, last_visit) VALUES (?, ?, ?, NULL, 1, ?, ?)",
  ).run(id, name, phone, spend, visitDate);
}

// ---------- Appointments ----------

function rowToAppointment(row: {
  id: string; qr_token: string; customer: string; phone: string; service: string; date: string; hour: string;
  status: string; checked_in_at: string | null; notes: string | null;
}): Appointment {
  return {
    id: row.id,
    qrToken: row.qr_token,
    customer: row.customer,
    phone: row.phone,
    service: row.service,
    date: row.date,
    hour: row.hour,
    status: row.status as AppointmentStatus,
    checkedInAt: row.checked_in_at,
    notes: row.notes,
  };
}

export function listAppointments(): Appointment[] {
  const rows = getDb().prepare("SELECT * FROM appointments ORDER BY date DESC, hour DESC").all();
  return (rows as Parameters<typeof rowToAppointment>[0][]).map(rowToAppointment);
}

export function getAppointmentByToken(token: string): Appointment | null {
  const row = getDb().prepare("SELECT * FROM appointments WHERE qr_token = ?").get(token);
  return row ? rowToAppointment(row as Parameters<typeof rowToAppointment>[0]) : null;
}

/** Busy hours per date (yyyy-mm-dd) within [from, to], excluding cancelled appointments. */
export function getBusyHoursInRange(from: string, to: string): Record<string, string[]> {
  const rows = getDb()
    .prepare("SELECT date, hour FROM appointments WHERE date BETWEEN ? AND ? AND status != 'cancelada'")
    .all(from, to) as { date: string; hour: string }[];
  const map: Record<string, string[]> = {};
  for (const row of rows) {
    (map[row.date] ??= []).push(row.hour);
  }
  return map;
}

export class SlotTakenError extends Error {}

export function createAppointment(input: {
  customer: string;
  phone: string;
  service: string;
  date: string;
  hour: string;
}): Appointment {
  const db = getDb();
  const id = `C-${nextSeq("appointments", 1049)}`;
  const qrToken = crypto.randomUUID();
  try {
    db.prepare(
      "INSERT INTO appointments (id, qr_token, customer, phone, service, date, hour, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')",
    ).run(id, qrToken, input.customer, input.phone, input.service, input.date, input.hour);
  } catch (err) {
    if (err instanceof Error && /UNIQUE constraint failed: appointments/.test(err.message)) {
      throw new SlotTakenError("Ese horario ya fue tomado.");
    }
    throw err;
  }
  touchCustomer(db, input.customer, input.phone, 0, input.date);
  return { id, qrToken, ...input, status: "pendiente", checkedInAt: null, notes: null };
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  getDb().prepare("UPDATE appointments SET status = ? WHERE id = ?").run(status, id);
}

export function checkInAppointment(token: string): Appointment | null {
  const db = getDb();
  const appt = getAppointmentByToken(token);
  if (!appt) return null;
  const nextStatus: AppointmentStatus =
    appt.status === "pendiente" || appt.status === "confirmada" ? "en_proceso" : appt.status;
  db.prepare("UPDATE appointments SET checked_in_at = datetime('now'), status = ? WHERE qr_token = ?").run(
    nextStatus,
    token,
  );
  return getAppointmentByToken(token);
}

// ---------- Orders ----------

function rowsToOrder(orderRow: {
  id: string; customer: string; phone: string; status: string; payment_method: string; mp_payment_id: string | null; date: string;
}, itemRows: { name: string; price: number; qty: number }[]): Order {
  return {
    id: orderRow.id,
    customer: orderRow.customer,
    phone: orderRow.phone,
    status: orderRow.status as OrderStatus,
    paymentMethod: orderRow.payment_method as PaymentMethod,
    mpPaymentId: orderRow.mp_payment_id,
    date: orderRow.date,
    items: itemRows,
  };
}

export function listOrders(): Order[] {
  const db = getDb();
  const orderRows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as {
    id: string; customer: string; phone: string; status: string; payment_method: string; mp_payment_id: string | null; date: string;
  }[];
  const itemStmt = db.prepare("SELECT name, price, qty FROM order_items WHERE order_id = ?");
  return orderRows.map((row) => rowsToOrder(row, itemStmt.all(row.id) as { name: string; price: number; qty: number }[]));
}

export function getOrder(id: string): Order | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | { id: string; customer: string; phone: string; status: string; payment_method: string; mp_payment_id: string | null; date: string }
    | undefined;
  if (!row) return null;
  const items = db.prepare("SELECT name, price, qty FROM order_items WHERE order_id = ?").all(id) as {
    name: string; price: number; qty: number;
  }[];
  return rowsToOrder(row, items);
}

export function createOrder(input: {
  customer: string;
  phone: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
}): Order {
  const db = getDb();
  const id = `P-${nextSeq("orders", 3305)}`;
  const total = input.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const create = db.transaction(() => {
    db.prepare(
      "INSERT INTO orders (id, customer, phone, status, payment_method) VALUES (?, ?, ?, 'pendiente', ?)",
    ).run(id, input.customer, input.phone, input.paymentMethod);
    const insertItem = db.prepare("INSERT INTO order_items (order_id, name, price, qty) VALUES (?, ?, ?, ?)");
    const decrementStock = db.prepare(
      "UPDATE products SET stock = MAX(0, stock - ?) WHERE name = ?",
    );
    for (const item of input.items) {
      insertItem.run(id, item.name, item.price, item.qty);
      decrementStock.run(item.qty, item.name);
    }
    touchCustomer(db, input.customer, input.phone, total, new Date().toISOString().slice(0, 10));
  });
  create();
  return { id, ...input, status: "pendiente", mpPaymentId: null, date: new Date().toISOString().slice(0, 10) };
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const db = getDb();
  const current = db.prepare("SELECT status FROM orders WHERE id = ?").get(id) as { status: OrderStatus } | undefined;
  const run = db.transaction(() => {
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
    // Cancelling releases the stock reserved when the order was placed.
    if (status === "cancelado" && current?.status !== "cancelado") {
      const items = db.prepare("SELECT name, qty FROM order_items WHERE order_id = ?").all(id) as {
        name: string;
        qty: number;
      }[];
      const restock = db.prepare("UPDATE products SET stock = stock + ? WHERE name = ?");
      for (const item of items) restock.run(item.qty, item.name);
    }
  });
  run();
}

export function setOrderPreference(id: string, preferenceId: string) {
  getDb().prepare("UPDATE orders SET mp_preference_id = ? WHERE id = ?").run(preferenceId, id);
}

export function markOrderPaid(orderId: string, paymentId: string): Order | null {
  const existing = getOrder(orderId);
  if (!existing) return null;
  getDb().prepare("UPDATE orders SET status = 'pagado', mp_payment_id = ? WHERE id = ?").run(paymentId, orderId);
  return getOrder(orderId);
}

export { orderTotal } from "./pricing";

// ---------- Dashboard ----------

export function getDashboardStats(today: string) {
  const db = getDb();
  const todayAppointments = (
    db.prepare("SELECT COUNT(*) as n FROM appointments WHERE date = ? AND status != 'cancelada'").get(today) as {
      n: number;
    }
  ).n;
  const pendingOrders = (
    db.prepare("SELECT COUNT(*) as n FROM orders WHERE status = 'pendiente'").get() as { n: number }
  ).n;
  const lowStock = listProducts().filter((p) => p.stock <= p.lowStockThreshold);

  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  const fromKey = fourteenDaysAgo.toISOString().slice(0, 10);
  const revenueRows = db
    .prepare(
      `SELECT o.date as date, SUM(oi.price * oi.qty) as total
       FROM orders o JOIN order_items oi ON oi.order_id = o.id
       WHERE o.date BETWEEN ? AND ? AND o.status != 'cancelado'
       GROUP BY o.date`,
    )
    .all(fromKey, today) as { date: string; total: number }[];
  const revenueByDate = new Map(revenueRows.map((r) => [r.date, r.total]));
  const revenueTrend: number[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    revenueTrend.push(revenueByDate.get(d.toISOString().slice(0, 10)) ?? 0);
  }
  const monthRevenue = revenueTrend.reduce((sum, v) => sum + v, 0);

  const recentOrders = listOrders().slice(0, 5);
  const upcoming = listAppointments()
    .filter((a) => a.date >= today && a.status !== "cancelada" && a.status !== "completada")
    .sort((a, b) => (a.date + a.hour).localeCompare(b.date + b.hour))
    .slice(0, 5);

  return { todayAppointments, pendingOrders, lowStock, monthRevenue, revenueTrend, recentOrders, upcoming };
}
