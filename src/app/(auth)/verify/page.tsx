"use client";
import { setSession, verifyOtp } from "@/services/auth.service";
import { useState } from "react";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const email = localStorage.getItem("bd_login_email") || "";
    const res = await verifyOtp(email, code);
    if (res.success) {
      setSession(res);
      window.location.href = "/admin/dashboard";
    } else {
      setMsg(res.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Verify Gmail</h1>
        <p className="mt-2 text-slate-600">Enter the 6-digit code sent to your Gmail.</p>
        <input value={code} onChange={e => setCode(e.target.value)} required placeholder="Verification Code" className="mt-6 w-full rounded-xl border px-4 py-3" />
        <button className="mt-4 w-full rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Verify & Login</button>
        {msg && <p className="mt-4 text-sm font-semibold text-red-600">{msg}</p>}
      </form>
    </main>
  );
}
