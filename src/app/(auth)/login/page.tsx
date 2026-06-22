"use client";
import { sendOtp } from "@/services/auth.service";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await sendOtp(email);
    if (res.success) {
      localStorage.setItem("bd_login_email", email);
      window.location.href = "/verify";
    } else {
      setMsg(res.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Blue Danube ERP</h1>
        <p className="mt-2 text-slate-600">Login with your registered Gmail.</p>
        <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="Gmail" className="mt-6 w-full rounded-xl border px-4 py-3" />
        <button className="mt-4 w-full rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Send Verification Code</button>
        {msg && <p className="mt-4 text-sm font-semibold text-red-600">{msg}</p>}
      </form>
    </main>
  );
}
