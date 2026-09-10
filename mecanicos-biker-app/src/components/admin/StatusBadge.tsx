import type { AppointmentStatus, OrderStatus } from "@/lib/admin-data";

const APPOINTMENT_STYLES: Record<AppointmentStatus, string> = {
  pendiente: "bg-amber-50 text-amber-700",
  confirmada: "bg-blue-50 text-blue-700",
  en_proceso: "bg-accent/10 text-accent-dark",
  completada: "bg-emerald-50 text-emerald-700",
  cancelada: "bg-red-50 text-red-600",
};

const ORDER_STYLES: Record<OrderStatus, string> = {
  pendiente: "bg-amber-50 text-amber-700",
  pagado: "bg-blue-50 text-blue-700",
  entregado: "bg-emerald-50 text-emerald-700",
  cancelado: "bg-red-50 text-red-600",
};

export function AppointmentStatusBadge({ status, label }: { status: AppointmentStatus; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ${APPOINTMENT_STYLES[status]}`}>
      {label}
    </span>
  );
}

export function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ${ORDER_STYLES[status]}`}>
      {label}
    </span>
  );
}
