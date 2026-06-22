"use client";

import { getProductImage, getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) =>
      `${p["Product Name"]} ${p.Brand} ${p.Category}`.toLowerCase().includes(q.toLowerCase())
    );
  }, [products, q]);

  const totalPages = Math.max(Math.ceil(filtered.length / perPage), 1);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="min-w-[260px] flex-1 rounded-xl border px-4 py-3"
        />
        <p className="text-sm font-bold text-slate-500">{filtered.length} products</p>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Product</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {current.map((p) => {
              const img = getProductImage(p);
              return (
                <tr key={p["Product ID"]} className="border-t">
                  <td className="p-3">
                    {img ? <img src={img} className="h-14 w-14 rounded-xl object-cover" alt="" /> : <div className="h-14 w-14 rounded-xl bg-slate-100" />}
                  </td>
                  <td className="p-3 font-black">{p["Product Name"]}</td>
                  <td className="p-3">{p.Brand}</td>
                  <td className="p-3">{p.Category}</td>
                  <td className="p-3">{p["Stock Qty"] || 0}</td>
                  <td className="p-3 font-black">{Number(p["Selling Price"] || 0).toLocaleString()} MMK</td>
                  <td className="p-3">{p.Status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-xl border px-4 py-2 font-bold disabled:opacity-40">Previous</button>
        <p className="text-sm font-bold">Page {page} / {totalPages}</p>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded-xl border px-4 py-2 font-bold disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
