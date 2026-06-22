"use client";

import { useMemo, useState } from "react";

export default function DataTable({ rows }: { rows: any[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  }, [rows, q]);

  const headers = filtered[0] ? Object.keys(filtered[0]).slice(0, 8) : [];
  const totalPages = Math.max(Math.ceil(filtered.length / perPage), 1);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search table..."
          className="min-w-[260px] flex-1 rounded-xl border px-4 py-3"
        />
        <p className="text-sm font-bold text-slate-500">{filtered.length} records</p>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>{headers.map((h) => <th key={h} className="p-3 font-black">{h}</th>)}</tr>
          </thead>
          <tbody>
            {current.map((r, i) => (
              <tr key={i} className="border-t">
                {headers.map((h) => <td key={h} className="p-3">{String(r[h] ?? "")}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-xl border px-4 py-2 font-bold disabled:opacity-40">
          Previous
        </button>
        <p className="text-sm font-bold">Page {page} / {totalPages}</p>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded-xl border px-4 py-2 font-bold disabled:opacity-40">
          Next
        </button>
      </div>
    </div>
  );
}
