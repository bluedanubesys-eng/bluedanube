"use client";

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function FinanceMiniCharts({ data }: { data: any }) {
  const chart = [
    { name: "Revenue", value: Number(data?.totalRevenue || 0) },
    { name: "Expenses", value: Number(data?.totalExpenses || 0) },
    { name: "Profit", value: Number(data?.netProfit || 0) },
    { name: "Inventory", value: Number(data?.inventoryValue || 0) },
  ];

  return (
    <div className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Finance Overview</h2>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
