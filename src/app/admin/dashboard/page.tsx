"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";
import FinanceMiniCharts from "@/components/charts/FinanceMiniCharts";

export default function DashboardPage() {
  const [d, setD] = useState<any>({});

  useEffect(() => {
    erpGet("dashboard", { shopId: CONFIG.defaultShopId }).then(res => setD(res.dashboard || {}));
  }, []);

  const stats = [
    ["Orders", d.totalOrders || 0],
    ["Revenue", `${d.totalRevenue || 0} MMK`],
    ["Expenses", `${d.totalExpenses || 0} MMK`],
    ["Net Profit", `${d.netProfit || 0} MMK`],
    ["Products", d.totalProducts || 0],
    ["Customers", d.totalCustomers || 0],
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map(([k, v]) => <Card key={k}><p className="text-sm text-slate-500">{k}</p><p className="mt-2 text-2xl font-bold">{v}</p></Card>)}
      </div>
    <FinanceMiniCharts data={d} />
    </AdminLayout>
  );
}
