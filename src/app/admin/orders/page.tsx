"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { erpGet, erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";

type OrderRow = Record<string, string | number | boolean | null | undefined>;

const statuses = [
  "Approved",
  "Payment Verified",
  "Packaging",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function loadOrders() {
    setLoading(true);
    const res = await erpGet("orders", { shopId: CONFIG.defaultShopId });
    setOrders((res.orders || []) as OrderRow[]);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter((o) =>
    JSON.stringify(o).toLowerCase().includes(q.toLowerCase())
  );

  async function updateStatus(orderId: string, status: string) {
    if (!orderId) return alert("Order ID missing");

    const r = await erpPost({
      action: "adminUpdateOrderStatus",
      shopId: CONFIG.defaultShopId,
      orderId,
      status,
    });

    alert(r.success ? `Order ${status}. Customer email sent.` : r.message);
    if (r.success) loadOrders();
  }

  async function sendDocs(orderId: string, email?: string) {
    const r = await erpPost({
      action: "sendOrderDocumentsEmail",
      shopId: CONFIG.defaultShopId,
      orderId,
      email: email || "",
      types: ["invoice", "receipt", "delivery"],
    });

    alert(r.success ? "PDF documents sent to customer Gmail." : r.message);
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-900">
            Order Management
          </p>
          <h1 className="mt-2 text-4xl font-black">Orders</h1>
          <p className="mt-2 text-slate-500">
            Approve, process, ship, deliver, cancel, and email customers automatically.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="rounded-full bg-blue-950 px-6 py-3 font-black text-white"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 rounded-3xl border bg-white p-5 shadow-sm">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search orders..."
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      {loading ? (
        <div className="mt-8 rounded-3xl border bg-white p-10 text-center font-bold text-slate-500">
          Loading orders...
        </div>
      ) : !filtered.length ? (
        <div className="mt-8 rounded-3xl border bg-white p-10 text-center">
          <h2 className="text-2xl font-black">No orders found</h2>
          <p className="mt-2 text-slate-500">Customer orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {filtered.map((o) => {
            const orderId = String(o["Order ID"] || "");
            const email = String(o.Email || o.email || o["Customer Email"] || "");
            const status = String(o["Order Status"] || "Pending");

            return (
              <article key={orderId} className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500">Order ID</p>
                    <h2 className="text-2xl font-black">{orderId}</h2>
                    <p className="mt-2 text-slate-600">
                      Name: {String(o["Customer Name"] || o.customerName || "-")} • Phone: {String(o.Phone || o.phone || "-")} • Email: {email || "No email"}
                    </p>
                    <p className="mt-1 text-slate-600">
                      Address: {String(o.Address || o.address || "-")} {String(o.Township || o.township || "")}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-950">
                      {status}
                    </span>
                    <p className="mt-3 text-2xl font-black">
                      {Number(o["Grand Total"] || 0).toLocaleString()} MMK
                    </p>
                    <p className="text-sm text-slate-500">
                      Payment: {String(o["Payment Status"] || "-")}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-7">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateStatus(orderId, s)}
                      className={`rounded-xl px-3 py-3 text-xs font-black text-white ${
                        s === "Cancelled" ? "bg-red-600" : "bg-blue-950"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => sendDocs(orderId, email)}
                    className="rounded-xl border px-5 py-3 font-black"
                  >
                    Send Invoice / Receipt / Delivery PDFs
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await erpPost({ action: "generateInvoicePdf", shopId: CONFIG.defaultShopId, orderId });
                      await erpPost({ action: "generateReceiptPdf", shopId: CONFIG.defaultShopId, orderId });
                      await erpPost({ action: "generateDeliverySlipPdf", shopId: CONFIG.defaultShopId, orderId });
                      alert("PDF documents generated.");
                    }}
                    className="rounded-xl border px-5 py-3 font-black"
                  >
                    Generate PDFs Only
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
