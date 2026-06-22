"use client";

import { useMemo, useState } from "react";

export default function DataTable({ rows }: { rows: any[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const headers = filtered[0] ? Object.keys(filtered[0]).slice(0, 8) : [];

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="mb-4 w-full rounded-xl border px-4 py-3" />
      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead><tr>{headers.map(h => <th key={h} className="p-3 font-black">{h}</th>)}</tr></thead>
          <tbody>{filtered.map((r,i)=><tr key={i} className="border-t">{headers.map(h=><td key={h} className="p-3">{String(r[h] ?? "")}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
