#!/usr/bin/env bash
set -e

cat > src/types/product.ts << 'TS'
export type Product = {
  "Created At"?: string;
  "Shop ID"?: string;
  "Product ID"?: string;
  "Product Name"?: string;
  Brand?: string;
  Category?: string;
  Description?: string;
  SKU?: string;
  Barcode?: string;
  "Image URL"?: string;
  Size?: string;
  Color?: string;
  "Cost Price"?: number;
  "Import Cost"?: number;
  "Total Cost"?: number;
  "Selling Price"?: number;
  "Stock Qty"?: number;
  "Reorder Level"?: number;
  "Owner Type"?: string;
  "Partner ID"?: string;
  Status?: string;
};
TS

cat > src/services/product.service.ts << 'TS'
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const res = await erpGet("products", { shopId: CONFIG.defaultShopId });
  return res.success ? res.products || [] : [];
}

export function getProductImage(product: Product) {
  const url = product["Image URL"] || "";

  if (!url) return "";

  const match = String(url).match(/\/d\/([^/]+)/);
  if (match?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  return String(url);
}
TS

cat > src/components/tables/ProductTable.tsx << 'TSX'
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
TSX

python3 << 'PY'
from pathlib import Path
p = Path("src/app/admin/products/page.tsx")
code = p.read_text()
if 'ProductTable' not in code:
    code = code.replace(
        'import { useState } from "react";',
        'import { useState } from "react";\nimport ProductTable from "@/components/tables/ProductTable";'
    )
    code = code.replace(
        '</AdminLayout>',
        '<ProductTable />\n    </AdminLayout>'
    )
p.write_text(code)
PY

cat > src/app/shop/page.tsx << 'TSX'
"use client";

import { getProductImage, getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data.filter((p) => String(p.Status).toLowerCase() === "active"));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return products.filter((p) =>
      `${p["Product Name"]} ${p.Brand} ${p.Category}`.toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-50 bg-blue-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <a href="/" className="text-2xl font-black">Blue Danube</a>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-xl px-5 py-3 text-slate-950 outline-none"
            placeholder="Search products, brands, categories..."
          />
          <a href="/cart" className="font-bold">Cart</a>
        </div>
      </header>

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 py-3 text-sm font-bold">
          <span>All</span>
          <span>Fashion</span>
          <span>Shoes</span>
          <span>Bags</span>
          <span>Accessories</span>
          <span>Deals</span>
          <span>New Arrival</span>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-3xl bg-gradient-to-r from-blue-950 to-slate-800 p-8 text-white">
          <p className="font-black uppercase tracking-[0.25em] text-blue-200">Blue Danube Shop</p>
          <h1 className="mt-3 text-4xl font-black">European Products Collection</h1>
          <p className="mt-3 text-blue-100">Real products loaded from Blue Danube ERP database.</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden rounded-3xl border bg-white p-5 shadow-sm lg:block">
            <h2 className="font-black">Filters</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="font-bold">Category</p>
                <p className="mt-2 text-slate-500">Fashion</p>
                <p className="text-slate-500">Shoes</p>
                <p className="text-slate-500">Bags</p>
              </div>
              <div>
                <p className="font-bold">Stock</p>
                <p className="mt-2 text-slate-500">Available products only</p>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Products</h2>
              <p className="text-sm font-bold text-slate-500">{filtered.length} items</p>
            </div>

            {loading && <p className="font-semibold">Loading products...</p>}

            {!loading && !filtered.length && (
              <div className="rounded-3xl border bg-white p-8 text-center text-slate-500">
                No products found.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((p) => {
                const img = getProductImage(p);

                return (
                  <div key={p["Product ID"]} className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    {img ? (
                      <img src={img} alt={p["Product Name"] || ""} className="aspect-square w-full object-cover" />
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200" />
                    )}

                    <div className="p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-900">
                        {p.Brand || "European Brand"}
                      </p>
                      <h3 className="mt-2 line-clamp-2 font-black">{p["Product Name"]}</h3>
                      <p className="mt-1 text-sm text-slate-500">{p.Category || "Product"}</p>
                      <p className="mt-3 text-xl font-black text-blue-950">{p["Selling Price"] || 0} MMK</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{p.Size || "Standard"}</span>
                        <span>{p.Color || ""}</span>
                      </div>
                      <button className="mt-4 w-full rounded-xl bg-blue-950 px-4 py-3 font-black text-white">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
TSX

echo "✅ Real product loading, admin product table, and shop product grid added"
npm run dev
