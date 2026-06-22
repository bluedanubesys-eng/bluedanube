#!/usr/bin/env bash
set -e

mkdir -p src/components/layout src/components/widgets src/components/tables src/app/brands/[brand] src/app/orders/[id]

cat > src/components/layout/MarketplaceHeader.tsx << 'TSX'
"use client";

import { useEffect, useState } from "react";
import { getCart } from "@/services/cart.service";

export default function MarketplaceHeader() {
  const [cartCount, setCartCount] = useState(0);

  function load() {
    setCartCount(getCart().reduce((s, i) => s + i.qty, 0));
  }

  useEffect(() => {
    load();
    window.addEventListener("cart-updated", load);
    return () => window.removeEventListener("cart-updated", load);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0b1f4d] text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-4">
        <a href="/" className="text-2xl font-black tracking-tight">Blue Danube</a>

        <div className="hidden flex-1 md:block">
          <input
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 outline-none"
            placeholder="Search European products, brands, categories..."
          />
        </div>

        <nav className="flex items-center gap-5 text-sm font-bold">
          <a href="/shop">Shop</a>
          <a href="/account">Orders</a>
          <a href="/partner">Partner</a>
          <a href="/cart" className="rounded-full bg-white px-4 py-2 text-[#0b1f4d]">
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </a>
        </nav>

        <div className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-bold lg:block">
          Account
        </div>
      </div>
    </header>
  );
}
TSX

cat > src/components/widgets/NotificationBell.tsx << 'TSX'
"use client";

export default function NotificationBell() {
  return (
    <button className="relative rounded-full border bg-white px-4 py-2 text-sm font-black shadow-sm">
      Notifications
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500" />
    </button>
  );
}
TSX

cat > src/components/widgets/RecentActivityWidget.tsx << 'TSX'
"use client";

import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";

export default function RecentActivityWidget() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    erpGet("activityLogs", { shopId: CONFIG.defaultShopId }).then((res) => {
      setRows((res.activityLogs || []).slice(-5).reverse());
    });
  }, []);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Recent Activity</h2>
      <div className="mt-5 space-y-3">
        {!rows.length && <p className="text-sm text-slate-500">No recent activity.</p>}
        {rows.map((r, i) => (
          <div key={i} className="rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="font-black">{r.Action || r.action || "Activity"}</p>
            <p className="text-slate-500">{r.Detail || r.detail || ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
TSX

cat > src/components/tables/DataTable.tsx << 'TSX'
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
TSX

cat > src/components/tables/ProductTable.tsx << 'TSX'
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
TSX

cat > src/app/page.tsx << 'TSX'
import MarketplaceHeader from "@/components/layout/MarketplaceHeader";

const sections = [
  ["New Arrivals", "Fresh European selections"],
  ["Premium Fashion", "Curated clothing and accessories"],
  ["Partner Picks", "Consignment products from trusted sellers"],
  ["Best Value", "Quality products with smart pricing"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <MarketplaceHeader />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#0b1f4d] via-[#17306f] to-[#07122d] p-10 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">Blue Danube Marketplace</p>
            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              European premium products for Myanmar customers.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              A refined marketplace for fashion, shoes, bags, accessories and lifestyle items with local ordering support.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/shop" className="rounded-full bg-white px-8 py-4 font-black text-[#0b1f4d]">Shop Collection</a>
              <a href="/partner" className="rounded-full border border-white/30 px-8 py-4 font-black">Sell With Us</a>
            </div>
          </div>

          <div className="grid gap-6">
            {sections.slice(0, 2).map(([title, text]) => (
              <div key={title} className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-900">{title}</p>
                <h2 className="mt-4 text-3xl font-black">{text}</h2>
                <a href="/shop" className="mt-6 inline-block font-black text-blue-950">Explore →</a>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {sections.map(([title, text]) => (
            <a href="/shop" key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
TSX

cat > src/app/brands/[brand]/page.tsx << 'TSX'
"use client";

import MarketplaceHeader from "@/components/layout/MarketplaceHeader";
import { addToCart } from "@/services/cart.service";
import { getProductImage, getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BrandPage() {
  const params = useParams();
  const brand = decodeURIComponent(String(params.brand || ""));
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((items) => {
      setProducts(items.filter((p) => String(p.Brand || "").toLowerCase() === brand.toLowerCase()));
    });
  }, [brand]);

  return (
    <main className="min-h-screen bg-slate-100">
      <MarketplaceHeader />
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="font-black uppercase tracking-[0.25em] text-blue-900">Brand Collection</p>
          <h1 className="mt-3 text-4xl font-black">{brand}</h1>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
            const img = getProductImage(p);
            return (
              <article key={p["Product ID"]} className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                {img ? <img src={img} className="aspect-square w-full rounded-t-3xl object-cover" alt="" /> : <div className="aspect-square rounded-t-3xl bg-slate-200" />}
                <div className="p-5">
                  <h2 className="font-black">{p["Product Name"]}</h2>
                  <p className="mt-2 text-xl font-black text-blue-950">{Number(p["Selling Price"] || 0).toLocaleString()} MMK</p>
                  <button onClick={() => addToCart(p)} className="mt-4 w-full rounded-full bg-blue-950 px-4 py-3 font-black text-white">Add to Cart</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
TSX

python3 << 'PY'
from pathlib import Path

# Upgrade product detail with gallery / related / PDF-style customer flow already preserved
p = Path("src/app/shop/[id]/page.tsx")
code = p.read_text()
code = code.replace('className="min-h-screen bg-slate-100"', 'className="min-h-screen bg-[#f5f6f8]"')
if 'Product Gallery' not in code:
    code = code.replace(
        '<p className="mt-4 text-slate-600">{product.Description || "Premium European product curated by Blue Danube."}</p>',
        '<p className="mt-4 text-slate-600">{product.Description || "Premium European product curated by Blue Danube."}</p><p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-blue-900">Product Gallery</p><div className="mt-3 grid grid-cols-4 gap-3">{[1,2,3,4].map((i)=><div key={i} className="aspect-square rounded-2xl border bg-slate-50" />)}</div>'
    )
p.write_text(code)

# Dashboard widgets
p = Path("src/app/admin/dashboard/page.tsx")
code = p.read_text()
if 'RecentActivityWidget' not in code:
    code = code.replace('import FinanceMiniCharts from "@/components/charts/FinanceMiniCharts";', 'import FinanceMiniCharts from "@/components/charts/FinanceMiniCharts";\nimport RecentActivityWidget from "@/components/widgets/RecentActivityWidget";')
    code = code.replace('<FinanceMiniCharts data={d} />', '<div className="grid gap-6 lg:grid-cols-[1fr_360px]"><FinanceMiniCharts data={d} /><RecentActivityWidget /></div>')
p.write_text(code)

# Admin layout with notification bell and user menu
p = Path("src/components/layout/AdminLayout.tsx")
code = p.read_text()
if 'NotificationBell' not in code:
    code = code.replace('import { logout } from "@/services/auth.service";', 'import { logout } from "@/services/auth.service";\nimport NotificationBell from "@/components/widgets/NotificationBell";')
    code = code.replace('<section className="p-6 pt-16 lg:ml-64 lg:pt-6">{children}</section>', '<section className="p-6 pt-16 lg:ml-64 lg:pt-6"><div className="mb-6 flex items-center justify-end gap-3"><NotificationBell /><button onClick={logout} className="rounded-full border bg-white px-4 py-2 text-sm font-black shadow-sm">Admin</button></div>{children}</section>')
p.write_text(code)

# Orders PDF buttons
p = Path("src/app/admin/orders/page.tsx")
code = p.read_text()
if 'Generate Invoice' not in code:
    code = code.replace(
        '<h1 className="text-3xl font-bold">Orders</h1>',
        '<h1 className="text-3xl font-bold">Orders</h1><div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-black">PDF Documents</h2><form onSubmit={async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const orderId=f.get("orderId"); await erpPost({action:"generateInvoicePdf",orderId}); await erpPost({action:"generateReceiptPdf",orderId}); await erpPost({action:"generateDeliverySlipPdf",orderId}); alert("PDF documents generated. Check Documents sheet.");}} className="mt-4 flex gap-3"><input name="orderId" placeholder="Order ID" className="flex-1 rounded-xl border px-4 py-3"/><button className="rounded-xl bg-blue-950 px-5 py-3 font-black text-white">Generate Invoice / Receipt / Delivery Slip</button></form></div>'
    )
p.write_text(code)
PY

echo "✅ Blue Danube marketplace visual upgrade added"
npm run build
