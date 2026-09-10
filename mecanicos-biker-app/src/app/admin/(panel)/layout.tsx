"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { hasAdminSession } from "@/lib/admin-auth";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!hasAdminSession()) {
      router.replace("/admin/login");
      return;
    }
    // One-time check against localStorage after mount, so server and client
    // agree on nothing being rendered until we know the session is valid.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked(true);
  }, [router]);

  if (!checked) return null;

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <Sidebar />
        </div>
      </aside>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <Sidebar onNavigate={() => setMobileNavOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
