"use client";

import { getProductImage, getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { useEffect, useState } from "react";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="mt-6 font-semibold">Loading products...</p>;

  if (!products.length) {
    return (
      <div className="mt-6 rounded-2xl border bg-white p-6 text-slate-500">
        No products yet.
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="p-4">Image</th>
            <th className="p-4">Product</th>
            <th className="p-4">Brand</th>
            <th className="p-4">Category</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Price</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const img = getProductImage(p);

            return (
              <tr key={p["Product ID"]} className="border-t">
                <td className="p-4">
                  {img ? (
                    <img src={img} alt={p["Product Name"] || ""} className="h-14 w-14 rounded-xl object-cover" />
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-slate-100" />
                  )}
                </td>
                <td className="p-4 font-bold">{p["Product Name"]}</td>
                <td className="p-4">{p.Brand}</td>
                <td className="p-4">{p.Category}</td>
                <td className="p-4">{p["Stock Qty"] || 0}</td>
                <td className="p-4 font-bold">{p["Selling Price"] || 0} MMK</td>
                <td className="p-4">{p.Status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
