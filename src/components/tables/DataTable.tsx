"use client";
import toast from "react-hot-toast";

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
