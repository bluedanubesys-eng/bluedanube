#!/usr/bin/env bash
set -e

cat > src/components/tables/DataTable.tsx << 'TSX'
"use client";

import { useMemo, useState } from "react";

export type TableRow = Record<string, string | number | boolean | null | undefined>;

export default function DataTable({
  rows,
  title = "Records",
}: {
  rows: TableRow[];
  title?: string;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    return rows.filter((r) =>
      JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
    );
  }, [rows, q]);

  const headers = filtered[0] ? Object.keys(filtered[0]).slice(0, 8) : [];
  const totalPages = Math.max(Math.ceil(filtered.length / perPage), 1);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <section className="rounded-[2rem] border bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="text-sm font-bold text-slate-500">{filtered.length} records</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search records..."
            className="rounded-xl border px-4 py-3"
          />
          <button
            onClick={() => alert("Export will be connected to backend export function.")}
            className="rounded-xl border px-5 py-3 font-black"
          >
            Export
          </button>
        </div>
      </div>

      {!filtered.length ? (
        <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
          No records found.
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="p-3 font-black">
                    {h}
                  </th>
                ))}
                <th className="p-3 font-black">Actions</th>
              </tr>
            </thead>

            <tbody>
              {current.map((r, i) => (
                <tr key={i} className="border-t">
                  {headers.map((h) => (
                    <td key={h} className="p-3">
                      {String(r[h] ?? "")}
                    </td>
                  ))}
                  <td className="p-3">
                    <button
                      onClick={() => alert(JSON.stringify(r, null, 2))}
                      className="rounded-lg border px-3 py-2 text-xs font-black"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="rounded-xl border px-4 py-2 font-bold disabled:opacity-40"
        >
          Previous
        </button>

        <p className="text-sm font-black">
          Page {page} / {totalPages}
        </p>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="rounded-xl border px-4 py-2 font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
}
TSX

python3 << 'PY'
from pathlib import Path

pages = {
  "documents": ("documents", "Documents", "Invoices, receipts, delivery slips and generated records."),
  "notifications": ("notifications", "Notifications", "System alerts, order updates and business notifications."),
  "activity-logs": ("activityLogs", "Activity Logs", "Operational activity history across the ERP."),
  "audit-logs": ("auditLogs", "Audit Logs", "Security and critical system audit trail."),
  "coupons": ("coupons", "Coupons", "Discount codes, campaigns and promotion records."),
  "reviews": ("reviews", "Reviews", "Customer product reviews and moderation records."),
  "analytics": ("dashboard", "Analytics", "Business intelligence and performance summary."),
}

for folder, (action, title, desc) in pages.items():
    p = Path(f"src/app/admin/{folder}/page.tsx")
    p.write_text(f'''"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import DataTable, {{ type TableRow }} from "@/components/tables/DataTable";
import {{ erpGet }} from "@/lib/api";
import {{ CONFIG }} from "@/lib/config";
import {{ useEffect, useState }} from "react";

export default function Page() {{
  const [rows, setRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {{
    erpGet("{action}", {{ shopId: CONFIG.defaultShopId }}).then((res) => {{
      const firstArray = Object.values(res).find((v) => Array.isArray(v)) as TableRow[] | undefined;
      if (firstArray) setRows(firstArray);
      else if (res.dashboard) setRows([res.dashboard as TableRow]);
      else setRows([]);
      setLoading(false);
    }});
  }}, []);

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-900">Admin Module</p>
          <h1 className="mt-2 text-4xl font-black">{title}</h1>
          <p className="mt-2 text-slate-500">{desc}</p>
        </div>

        <button
          onClick={{() => window.location.reload()}}
          className="rounded-full bg-blue-950 px-6 py-3 font-black text-white"
        >
          Refresh
        </button>
      </div>

      {{loading ? (
        <div className="rounded-[2rem] border bg-white p-10 text-center font-bold text-slate-500">
          Loading {title.lower()}...
        </div>
      ) : (
        <DataTable title="{title}" rows={{rows}} />
      )}}
    </AdminLayout>
  );
}}
''')
PY

npm run build
./test-pages.sh
