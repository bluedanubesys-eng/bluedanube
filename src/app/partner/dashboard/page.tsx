"use client";

import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

type PartnerDashboard = {
  totalOrders?: number;
  totalSales?: number;
  totalCommission?: number;
  paidCommission?: number;
  unpaidCommission?: number;
};

type CommissionRow = Record<string, string | number | boolean | null | undefined>;

export default function PartnerDashboardPage() {
  const [partnerId, setPartnerId] = useState("");
  const [dashboard, setDashboard] = useState<PartnerDashboard | null>(null);
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    setMessage("");
    const res = await erpGet("partnerDashboard", {
      shopId: CONFIG.defaultShopId,
      partnerId,
    });

    if (!res.success) {
      setDashboard(null);
      setCommissions([]);
      setMessage(res.message || "Partner dashboard not found.");
      return;
    }

    setDashboard(res.dashboard || {});
    setCommissions(res.commissions || []);
  }

  const cards = [
    ["Orders", dashboard?.totalOrders || 0],
    ["Total Sales", `${Number(dashboard?.totalSales || 0).toLocaleString()} MMK`],
    ["Commission", `${Number(dashboard?.totalCommission || 0).toLocaleString()} MMK`],
    ["Paid", `${Number(dashboard?.paidCommission || 0).toLocaleString()} MMK`],
    ["Unpaid", `${Number(dashboard?.unpaidCommission || 0).toLocaleString()} MMK`],
  ];

  const headers = commissions[0] ? Object.keys(commissions[0]).slice(0, 8) : [];

  return (
    <main className="min-h-screen pb-16 md:pb-0 bg-[#f5f6f8] text-slate-950">
      <header className="bg-[#071b46] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-black">Blue Danube Partner</a>
          <nav className="flex gap-5 text-sm font-bold">
            <a href="/partner">Partner Program</a>
            <a href="/shop">Shop</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0b255c]">
            Partner Portal
          </p>
          <h1 className="mt-2 text-4xl font-black">Commission & Settlement Dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Enter your Partner ID to view sales, commission, payment status, and settlement history.
          </p>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <input
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              placeholder="Enter Partner ID"
              className="flex-1 rounded-xl border px-4 py-3"
            />
            <button
              onClick={load}
              className="rounded-xl bg-[#0b255c] px-6 py-3 font-black text-white"
            >
              Open Dashboard
            </button>
          </div>

          {message && <p className="mt-4 font-bold text-red-600">{message}</p>}
        </div>

        {dashboard && (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {cards.map(([title, value]) => (
                <div key={title} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-bold text-slate-500">{title}</p>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black">Commission History</h2>
                    <p className="text-sm text-slate-500">{commissions.length} records</p>
                  </div>
                  <button className="rounded-full border px-5 py-2 text-sm font-black">
                    Export
                  </button>
                </div>

                {!commissions.length ? (
                  <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
                    No commission records yet.
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          {headers.map((h) => (
                            <th key={h} className="p-3 font-black">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {commissions.map((row, i) => (
                          <tr key={i} className="border-t">
                            {headers.map((h) => (
                              <td key={h} className="p-3">{String(row[h] ?? "")}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-2xl font-black">Settlement Summary</h2>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Unpaid Commission</p>
                    <p className="text-2xl font-black text-[#0b255c]">
                      {Number(dashboard.unpaidCommission || 0).toLocaleString()} MMK
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Paid Commission</p>
                    <p className="text-2xl font-black">
                      {Number(dashboard.paidCommission || 0).toLocaleString()} MMK
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="font-black text-[#0b255c]">Settlement Note</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Payments are reviewed by Blue Danube finance before final settlement.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </section>
    <MobileBottomNav />
    </main>
  );
}
