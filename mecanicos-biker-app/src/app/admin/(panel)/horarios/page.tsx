import { getWeeklySchedule, listScheduleOverrides } from "@/lib/db";
import { HorariosClient } from "./horarios-client";

export const dynamic = "force-dynamic";

export default function AdminHorariosPage() {
  const weekly = getWeeklySchedule();
  const overrides = listScheduleOverrides();
  return <HorariosClient initialWeekly={weekly} initialOverrides={overrides} />;
}
