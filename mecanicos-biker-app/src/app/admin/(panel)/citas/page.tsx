import { listAppointments } from "@/lib/db";
import { CitasClient } from "./citas-client";

export const dynamic = "force-dynamic";

export default function AdminCitasPage() {
  const appointments = listAppointments();
  return <CitasClient initialAppointments={appointments} />;
}
