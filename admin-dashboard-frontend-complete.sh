#!/usr/bin/env bash
set -e

cat > src/app/admin/dashboard/page.tsx << 'TSX'
"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import FinanceMiniCharts from "@/components/charts/FinanceMiniCharts";
import RecentActivityWidget from "@/components/widgets/RecentActivityWidget";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";

type Dashboard = {
  totalOrders?: number;
  totalRevenue?: number;
  totalExpenses?: number;
  netProfit?: number;
  totalProducts?: number;
  totalCustomers?: number;
  inventoryValue?: number;
};

type Row = Record<string, string | number | boolean | null | undefined>;

export default function DashboardPage() {
  const [d, setD] = useState<Dashboard>({});
  const [orders, setOrders] = useState<Row[]>([]);
  const [payments, setPayments] = useState<Row[]>([]);
  const [products, setProducts] = useState<Row[]>([]);

  useEffect(() => {
    erpGet("dashboard", { shopId: CONFIG.defaultShopId }).then((res) => {
      setD(res.dashboard || {});
    });

    erpGet("orders", { shopId: CONFIG.defaultShopId }).then((res) => {
      setOrders((res.orders || []).slice(-5).reverse());
    });

    erpGet("payments", { shopId: CONFIG.defaultShopId }).then((res) => {
      setPayments((res.payments || []).slice(-5).reverse());
    });

    erpGet("products", { shopId: CONFIG.defaultShopId }).then((res) => {
      const rows = res.products || [];
      setProducts(
        rows
          .filter((p: Row) => Number(p["Stock Qty"] || 0) <= Number(p["Reorder Level"] || 0))
          .slice(0, 5)
      );
    });
  }, []);

  const stats = [
    ["Orders", d.totalOrders || 0],
    ["Revenue", `${Number(d.totalRevenue || 0).toLocaleString()} MMK`],
    ["Expenses", `${Number(d.totalExpenses || 0).toLocaleString()} MMK`],
    ["Net Profit", `${Number(d.netProfit || 0).toLocaleString()} MMK`],
    ["Products", d.totalProducts || 0],
    ["Customers", d.totalCustomers || 0],
  ];

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-900">
            Blue Danube ERP
          </p>
          <h1 className="mt-2 text-4xl font-black">Executive Dashboard</h1>
          <p className="mt-2 text-slate-500">
            Sales, inventory, finance, partner and operational overview.
          </p>
        </div>

        <a
          href="/admin/reports"
          className="rounded-full bg-blue-950 px-6 py-3 font-black text-white"
        >
          Open Reports
        </a>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map(([k, v]) => (
          <Card key={k}>
            <p className="text-sm font-bold text-slate-500">{k}</p>
            <p className="mt-2 text-3xl font-black">{v}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
        <FinanceMiniCharts data={d} />
        <RecentActivityWidget />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <section className="rounded-[2rem] border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm font-black text-blue-950">View all</a>
          </div>

          <div className="space-y-3">
            {!orders.length && <p className="text-sm text-slate-500">No recent orders.</p>}
            {orders.map((o, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-black">{String(o["Order ID"] || "-")}</p>
                <div className="mt-1 flex justify-between text-sm text-slate-500">
                  <span>{String(o["Order Status"] || "Pending")}</span>
                  <b>{Number(o["Grand Total"] || 0).toLocaleString()} MMK</b>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black">Low Stock</h2>
            <a href="/admin/products" className="text-sm font-black text-blue-950">Products</a>
          </div>

          <div className="space-y-3">
            {!products.length && <p className="text-sm text-slate-500">No low stock items.</p>}
            {products.map((p, i) => (
              <div key={i} className="rounded-2xl bg-amber-50 p-4">
                <p className="font-black">{String(p["Product Name"] || "-")}</p>
                <div className="mt-1 flex justify-between text-sm text-slate-600">
                  <span>Stock: {String(p["Stock Qty"] || 0)}</span>
                  <b>Reorder: {String(p["Reorder Level"] || 0)}</b>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black">Recent Payments</h2>
            <a href="/admin/payments" className="text-sm font-black text-blue-950">Payments</a>
          </div>

          <div className="space-y-3">
            {!payments.length && <p className="text-sm text-slate-500">No recent payments.</p>}
            {payments.map((p, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-black">{String(p["Payment ID"] || p["Order ID"] || "-")}</p>
                <div className="mt-1 flex justify-between text-sm text-slate-500">
                  <span>{String(p["Payment Method"] || "-")}</span>
                  <b>{Number(p.Amount || 0).toLocaleString()} MMK</b>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
TSX

npm run build
./test-pages.sh
