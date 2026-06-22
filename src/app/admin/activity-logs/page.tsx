"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import DataTable, { type TableRow } from "@/components/tables/DataTable";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";

export default function Page() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    erpGet("activityLogs", { shopId: CONFIG.defaultShopId }).then((res) => {
      const firstArray = Object.values(res).find((v) => Array.isArray(v)) as TableRow[] | undefined;
      if (firstArray) setRows(firstArray);
      else if (res.dashboard) setRows([res.dashboard as TableRow]);
      else setRows([]);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-900">Admin Module</p>
          <h1 className="mt-2 text-4xl font-black">Activity Logs</h1>
          <p className="mt-2 text-slate-500">Operational activity history across the ERP.</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-blue-950 px-6 py-3 font-black text-white"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border bg-white p-10 text-center font-bold text-slate-500">
          Loading activity logs...
        </div>
      ) : (
        <DataTable title="Activity Logs" rows={rows} />
      )}
    </AdminLayout>
  );
}
