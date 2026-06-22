#!/usr/bin/env bash
set -e

cat > src/app/account/page.tsx << 'TSX'
"use client";

import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useMemo, useState } from "react";

type OrderRow = Record<string, string | number | boolean | null | undefined>;

const trackingSteps = [
  "Pending",
  "Confirmed",
  "Packing",
  "Ready To Ship",
  "Out For Delivery",
  "Delivered",
  "Completed",
];

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadOrders() {
    setLoading(true);
    setMessage("");

    const res = await erpGet("customerOrders", {
      shopId: CONFIG.defaultShopId,
      email,
    });

    if (!res.success) {
      setOrders([]);
      setMessage(res.message || "No orders found.");
      setLoading(false);
      return;
    }

    setOrders(res.orders || []);
    setLoading(false);
  }

  const totalSpend = useMemo(() => {
    return orders.reduce((sum, o) => sum + Number(o["Grand Total"] || 0), 0);
  }, [orders]);

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <header className="bg-[#071b46] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-black">Blue Danube Account</a>
          <nav className="flex gap-5 text-sm font-bold">
            <a href="/shop">Shop</a>
            <a href="/cart">Cart</a>
            <a href="/partner">Partner</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0b255c]">
            Customer Portal
          </p>
          <h1 className="mt-2 text-4xl font-black">Order History & Tracking</h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Enter your Gmail to view your orders, payment status, delivery status, and tracking progress.
          </p>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Gmail"
              className="flex-1 rounded-xl border px-4 py-3"
            />
            <button
              onClick={loadOrders}
              disabled={loading}
              className="rounded-xl bg-[#0b255c] px-6 py-3 font-black text-white disabled:opacity-60"
            >
              {loading ? "Loading..." : "Find Orders"}
            </button>
          </div>

          {message && <p className="mt-4 font-bold text-red-600">{message}</p>}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-500">Total Orders</p>
            <p className="mt-2 text-3xl font-black">{orders.length}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-500">Total Spend</p>
            <p className="mt-2 text-3xl font-black">{totalSpend.toLocaleString()} MMK</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-500">Support Status</p>
            <p className="mt-2 text-3xl font-black">Active</p>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {!orders.length && !loading && (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-black">No order selected</h2>
              <p className="mt-2 text-slate-500">Search with your Gmail to see your order history.</p>
            </div>
          )}

          {orders.map((order) => {
            const status = String(order["Order Status"] || "Pending");
            const activeIndex = Math.max(trackingSteps.indexOf(status), 0);

            return (
              <article key={String(order["Order ID"])} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500">Order ID</p>
                    <h2 className="text-2xl font-black">{String(order["Order ID"] || "-")}</h2>
                    <p className="mt-1 text-slate-500">{String(order["Customer Name"] || "")}</p>
                  </div>

                  <div className="text-right">
                    <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-950">
                      {status}
                    </span>
                    <p className="mt-3 text-2xl font-black">
                      {Number(order["Grand Total"] || 0).toLocaleString()} MMK
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-7">
                  {trackingSteps.map((step, index) => (
                    <div
                      key={step}
                      className={`rounded-2xl p-4 text-center text-xs font-black ${
                        index <= activeIndex
                          ? "bg-[#0b255c] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 border-t pt-5 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-slate-500">Payment</p>
                    <p className="font-black">{String(order["Payment Status"] || "-")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Method</p>
                    <p className="font-black">{String(order["Payment Method"] || "-")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Township</p>
                    <p className="font-black">{String(order.Township || "-")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Delivery Fee</p>
                    <p className="font-black">{Number(order["Delivery Fee"] || 0).toLocaleString()} MMK</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
TSX

npm run build
./test-pages.sh
