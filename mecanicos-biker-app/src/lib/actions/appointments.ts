"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";
import {
  createAppointment as dbCreateAppointment,
  getAppointmentByToken as dbGetAppointmentByToken,
  getBusyHoursInRange,
  checkInAppointment as dbCheckInAppointment,
  updateAppointmentStatus as dbUpdateAppointmentStatus,
  SlotTakenError,
  type AppointmentStatus,
} from "@/lib/db";

async function siteUrl() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") || host?.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function getMonthAvailability(from: string, to: string) {
  return getBusyHoursInRange(from, to);
}

export async function bookAppointment(input: {
  customer: string;
  phone: string;
  service: string;
  date: string;
  hour: string;
}) {
  try {
    const appointment = dbCreateAppointment(input);
    const base = await siteUrl();
    const url = `${base}/cita/${appointment.qrToken}`;
    const qrDataUrl = await QRCode.toDataURL(url, { margin: 1, width: 320 });
    revalidatePath("/admin/citas");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/clientes");
    return { ok: true as const, id: appointment.id, url, qrDataUrl };
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return { ok: false as const, error: err.message };
    }
    throw err;
  }
}

export async function getAppointmentByToken(token: string) {
  return dbGetAppointmentByToken(token);
}

export async function checkInAppointment(token: string) {
  const appointment = dbCheckInAppointment(token);
  revalidatePath("/admin/citas");
  revalidatePath("/admin/dashboard");
  return appointment;
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  dbUpdateAppointmentStatus(id, status);
  revalidatePath("/admin/citas");
  revalidatePath("/admin/dashboard");
}
