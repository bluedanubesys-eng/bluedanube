"use client";

import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

export default function PartnerDashboardPage() {
  const [partnerId, setPartnerId] = useState("");
  const [data, setData] = useState<any>(null);

  async function load() {
    const res = await erpGet("partnerDashboard", { shopId: CONFIG.defaultShopId, partnerId });
    setData(res);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-[#0f1f4a] text-white"><div className="mx-auto max-w-7xl px-6 py-4 text-2xl font-black">Partner Dashboard</div></header>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black">Partner Settlement</h1>
          <div className="mt-5 flex gap-3">
            <input value={partnerId} onChange={e=>setPartnerId(e.target.value)} className="flex-1 rounded-xl border px-4 py-3" placeholder="Partner ID" />
            <button onClick={load} className="rounded-xl bg-blue-950 px-6 py-3 font-black text-white">Open</button>
          </div>
        </div>
        {data?.dashboard && (
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {Object.entries(data.dashboard).map(([k,v]) => <div key={k} className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-black">{String(v)}</p></div>)}
          </div>
        )}
      </section>
    </main>
  );
}
