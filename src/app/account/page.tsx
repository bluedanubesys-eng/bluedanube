"use client";

import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await erpGet("customerOrders", { shopId: CONFIG.defaultShopId, email });
    if (res.success) setOrders(res.orders || []);
    else setMsg(res.message);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-[#0f1f4a] text-white"><div className="mx-auto max-w-7xl px-6 py-4 text-2xl font-black">Blue Danube Account</div></header>
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black">Order History</h1>
          <div className="mt-5 flex gap-3">
            <input value={email} onChange={e=>setEmail(e.target.value)} className="flex-1 rounded-xl border px-4 py-3" placeholder="Your Gmail" />
            <button onClick={load} className="rounded-xl bg-blue-950 px-6 py-3 font-black text-white">Find Orders</button>
          </div>
        </div>
        {msg && <p className="mt-4 font-bold text-red-600">{msg}</p>}
        <div className="mt-6 space-y-4">
          {orders.map(o => (
            <div key={o["Order ID"]} className="rounded-3xl bg-white p-5 shadow-sm">
              <b>{o["Order ID"]}</b>
              <p>{o["Order Status"]} • {o["Payment Status"]}</p>
              <p className="font-black">{o["Grand Total"]} MMK</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
