"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { LogoMark } from "@/components/Logo";
import { checkDemoCredentials, setAdminSession } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (checkDemoCredentials(user, pass)) {
      setAdminSession();
      router.push("/admin/dashboard");
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6">
      <motion.div
        initial={{ opacity: 1, y: 16 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-3xl bg-white p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark className="mb-4 h-14 w-14" />
          <h1 className="text-xl font-semibold text-[#1d1d1f]">Panel administrativo</h1>
          <p className="mt-1 text-[13.5px] text-muted">Mecánicos Biker</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-muted">
            Usuario
            <input
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                setError(false);
              }}
              type="text"
              autoComplete="username"
              className="h-11 rounded-xl border border-black/10 px-3.5 text-[14.5px] text-[#1d1d1f] outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-muted">
            Contraseña
            <input
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setError(false);
              }}
              type="password"
              autoComplete="current-password"
              className="h-11 rounded-xl border border-black/10 px-3.5 text-[14.5px] text-[#1d1d1f] outline-none transition-colors focus:border-accent"
            />
          </label>

          {error && (
            <p className="text-[13px] font-medium text-red-600">Usuario o contraseña incorrectos.</p>
          )}

          <button
            type="submit"
            className="mt-2 flex h-11 items-center justify-center rounded-full bg-accent text-[14.5px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-center text-[12px] text-muted">
          Demo: usuario <span className="font-mono">admin</span> · contraseña{" "}
          <span className="font-mono">biker2026</span>
        </p>
      </motion.div>
    </div>
  );
}
