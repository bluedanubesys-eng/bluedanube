#!/usr/bin/env bash
set -e

mkdir -p src/components/admin src/components/marketplace src/components/checkout src/components/state

cat > src/components/admin/AdminPageShell.tsx << 'TSX'
export default function AdminPageShell({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-3xl border bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-900">Blue Danube ERP</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
TSX

cat > src/components/admin/ProfessionalDataTable.tsx << 'TSX'
"use client";

import { useMemo, useState } from "react";

export default function ProfessionalDataTable({
  rows,
  title = "Records",
}: {
  rows: any[];
  title?: string;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    return rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(query.toLowerCase())
    );
  }, [rows, query]);

  const headers = filtered[0] ? Object.keys(filtered[0]).slice(0, 8) : [];
  const totalPages = Math.max(Math.ceil(filtered.length / perPage), 1);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <section className="rounded-3xl border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
        <div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="text-sm font-semibold text-slate-500">{filtered.length} records</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
          />
          <button className="rounded-2xl border bg-white px-4 py-3 text-sm font-black">Export</button>
          <button className="rounded-2xl bg-blue-950 px-4 py-3 text-sm font-black text-white">Add New</button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {headers.map((h) => (
                <th key={h} className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">{h}</th>
              ))}
              <th className="p-4 text-xs font-black uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {current.map((row, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                {headers.map((h) => (
                  <td key={h} className="max-w-[220px] truncate p-4">{String(row[h] ?? "")}</td>
                ))}
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="rounded-xl border px-3 py-2 text-xs font-black">View</button>
                    <button className="rounded-xl border px-3 py-2 text-xs font-black">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!filtered.length && (
        <div className="p-10 text-center">
          <h3 className="text-xl font-black">No data found</h3>
          <p className="mt-2 text-sm text-slate-500">Create records or adjust your search.</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t p-5">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-xl border px-4 py-2 text-sm font-black disabled:opacity-40">Previous</button>
        <p className="text-sm font-bold">Page {page} of {totalPages}</p>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded-xl border px-4 py-2 text-sm font-black disabled:opacity-40">Next</button>
      </div>
    </section>
  );
}
TSX

cat > src/components/checkout/CheckoutSteps.tsx << 'TSX'
export default function CheckoutSteps({ step }: { step: number }) {
  const steps = ["Cart", "Customer", "Payment", "Review"];
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-4">
      {steps.map((s, i) => (
        <div key={s} className={`rounded-2xl border p-4 text-center text-sm font-black ${i + 1 <= step ? "bg-blue-950 text-white" : "bg-white text-slate-500"}`}>
          {i + 1}. {s}
        </div>
      ))}
    </div>
  );
}
TSX

cat > src/components/marketplace/ProductCard.tsx << 'TSX'
"use client";

import { addToCart } from "@/services/cart.service";
import { getProductImage } from "@/services/product.service";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const img = getProductImage(product);
  const stock = Number(product["Stock Qty"] || 0);

  return (
    <article className="group overflow-hidden rounded-[1.7rem] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
      <a href={`/shop/${product["Product ID"]}`} className="block">
        <div className="relative aspect-square bg-slate-100">
          {img ? (
            <img src={img} alt={product["Product Name"] || ""} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">No Image</div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-blue-950 shadow">{product.Category || "Product"}</span>
          <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-red-600">♡</span>
        </div>
      </a>

      <div className="p-5">
        <a href={`/brands/${encodeURIComponent(product.Brand || "European Brand")}`} className="text-xs font-black uppercase tracking-[0.2em] text-blue-900">
          {product.Brand || "European Brand"}
        </a>
        <a href={`/shop/${product["Product ID"]}`}>
          <h3 className="mt-2 line-clamp-2 min-h-[48px] text-lg font-black hover:text-blue-900">{product["Product Name"]}</h3>
        </a>
        <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>★ 4.8</span>
          <span>{stock > 0 ? `${stock} in stock` : "Out of stock"}</span>
        </div>
        <p className="mt-4 text-2xl font-black text-blue-950">{Number(product["Selling Price"] || 0).toLocaleString()} MMK</p>
        <button
          disabled={stock <= 0}
          onClick={() => addToCart(product)}
          className="mt-5 w-full rounded-full bg-[#0f1f4a] px-5 py-3 font-black text-white transition hover:bg-[#17306f] disabled:bg-slate-300"
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
TSX

cat > src/app/shop/page.tsx << 'TSX'
"use client";

import MarketplaceHeader from "@/components/layout/MarketplaceHeader";
import ProductCard from "@/components/marketplace/ProductCard";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";

const categories = ["All", "Fashion", "Shoes", "Bags", "Accessories", "Beauty", "Lifestyle"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 12;

  useEffect(() => {
    erpGet("products", { shopId: CONFIG.defaultShopId }).then((res) => {
      const data = res.success ? res.products || [] : [];
      setProducts(data.filter((p: Product) => String(p.Status || "").toLowerCase() === "active"));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const q = query.toLowerCase();
      const matchText = `${p["Product Name"] || ""} ${p.Brand || ""} ${p.Category || ""}`.toLowerCase().includes(q);
      const matchCat = category === "All" || String(p.Category || "").toLowerCase() === category.toLowerCase();
      return matchText && matchCat;
    });
    if (sort === "low") list = [...list].sort((a, b) => Number(a["Selling Price"] || 0) - Number(b["Selling Price"] || 0));
    if (sort === "high") list = [...list].sort((a, b) => Number(b["Selling Price"] || 0) - Number(a["Selling Price"] || 0));
    return list;
  }, [products, query, category, sort]);

  const totalPages = Math.max(Math.ceil(filtered.length / perPage), 1);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <MarketplaceHeader />

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-4">
          {categories.map((c) => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }} className={`rounded-full px-5 py-2 text-sm font-black ${category === c ? "bg-[#0f1f4a] text-white" : "bg-slate-100 text-slate-700"}`}>
              {c}
            </button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#0f1f4a] to-[#07122d] p-8 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">Blue Danube Shop</p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">European Products Collection</h1>
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="mt-6 w-full rounded-full bg-white px-6 py-4 text-slate-950 outline-none" placeholder="Search products, brands, categories..." />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:block">
            <h2 className="text-xl font-black">Filters</h2>
            <div className="mt-6 space-y-5 text-sm">
              <div>
                <p className="font-black">Category</p>
                <div className="mt-3 space-y-2">{categories.map((c) => <button key={c} onClick={() => setCategory(c)} className="block text-slate-600 hover:text-blue-950">{c}</button>)}</div>
              </div>
              <div>
                <p className="font-black">Price</p>
                <p className="mt-2 text-slate-500">Use sorting dropdown</p>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">Recommended Products</h2>
                <p className="text-sm font-semibold text-slate-500">{filtered.length} items available</p>
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border bg-white px-5 py-3 text-sm font-bold">
                <option value="popular">Sort: Popular</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>

            {loading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map(i => <div key={i} className="animate-pulse rounded-[1.7rem] bg-white p-4"><div className="aspect-square rounded-2xl bg-slate-200" /><div className="mt-4 h-4 w-2/3 rounded bg-slate-200" /></div>)}</div>}

            {!loading && !filtered.length && <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm"><h3 className="text-2xl font-black">No products found</h3><p className="mt-2 text-slate-500">Add products from ERP admin or change your search.</p></div>}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {current.map((p) => <ProductCard key={p["Product ID"]} product={p} />)}
            </div>

            {!!filtered.length && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-full border bg-white px-5 py-3 font-black disabled:opacity-40">Previous</button>
                <p className="font-black">Page {page} / {totalPages}</p>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded-full border bg-white px-5 py-3 font-black disabled:opacity-40">Next</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
TSX

cat > src/app/checkout/page.tsx << 'TSX'
"use client";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import MarketplaceHeader from "@/components/layout/MarketplaceHeader";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { fileToBase64 } from "@/lib/file";
import { cartTotal, clearCart, getCart } from "@/services/cart.service";
import type { CartItem } from "@/types/cart";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setItems(getCart()), []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const f = new FormData(e.currentTarget);
    const file = f.get("paymentScreenshot") as File;
    const paymentScreenshotBase64 = file && file.size > 0 ? await fileToBase64(file) : "";
    const subtotal = cartTotal(items);
    const deliveryFee = Number(f.get("deliveryFee") || 0);
    const grandTotal = subtotal + deliveryFee;

    const res = await erpPost({
      action: "createOrderWithPaymentScreenshot",
      shopId: CONFIG.defaultShopId,
      customerName: f.get("customerName"),
      phone: f.get("phone"),
      email: f.get("email"),
      address: f.get("address"),
      township: f.get("township"),
      paymentMethod: f.get("paymentMethod"),
      deliveryFee,
      discount: 0,
      tax: 0,
      paymentScreenshotBase64,
      paymentScreenshotName: file && file.size > 0 ? file.name : "",
      items: items.map(i => ({
        productId: i.product["Product ID"],
        productName: i.product["Product Name"],
        brand: i.product.Brand,
        size: i.product.Size,
        color: i.product.Color,
        qty: i.qty,
        unitPrice: Number(i.product["Selling Price"] || 0),
      })),
      remarks: `Checkout total ${grandTotal} MMK`,
    });

    if (res.success) {
      clearCart();
      setItems([]);
      setMsg(`Order submitted successfully. Order ID: ${res.orderId}`);
    } else setMsg(res.message || "Order failed");

    setLoading(false);
  }

  const subtotal = cartTotal(items);

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <MarketplaceHeader />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-black">Checkout</h1>
        <CheckoutSteps step={items.length ? 4 : 1} />

        {!items.length && !msg && <div className="mt-8 rounded-3xl border bg-white p-8 text-center font-bold text-slate-500">Your cart is empty.</div>}

        {!!items.length && (
          <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-6">
              <div className="grid gap-4 rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black">1. Customer Information</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="customerName" required placeholder="Customer Name" className="rounded-xl border px-4 py-3" />
                  <input name="phone" required placeholder="Phone" className="rounded-xl border px-4 py-3" />
                </div>
                <input name="email" type="email" required placeholder="Gmail" className="rounded-xl border px-4 py-3" />
                <input name="address" required placeholder="Address" className="rounded-xl border px-4 py-3" />
                <input name="township" placeholder="Township" className="rounded-xl border px-4 py-3" />
              </div>

              <div className="grid gap-4 rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black">2. Payment Information</h2>
                <select name="paymentMethod" className="rounded-xl border px-4 py-3">
                  <option>KBZ Pay</option><option>Wave Pay</option><option>AYA Pay</option><option>Bank Transfer</option><option>Cash</option>
                </select>
                <input name="paymentScreenshot" type="file" accept="image/*" required className="rounded-xl border px-4 py-3" />
                <input name="deliveryFee" type="number" defaultValue="0" placeholder="Delivery Fee" className="rounded-xl border px-4 py-3" />
              </div>
            </div>

            <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">3. Review Order</h2>
              <div className="mt-5 space-y-3">{items.map(i => <div key={i.product["Product ID"]} className="flex justify-between text-sm"><span>{i.product["Product Name"]} × {i.qty}</span><b>{Number(i.product["Selling Price"] || 0) * i.qty} MMK</b></div>)}</div>
              <div className="mt-6 border-t pt-4 flex justify-between text-lg"><span className="font-black">Subtotal</span><span className="font-black">{subtotal.toLocaleString()} MMK</span></div>
              <button disabled={loading} className="mt-6 w-full rounded-full bg-blue-950 px-6 py-4 font-black text-white disabled:opacity-60">{loading ? "Submitting..." : "Confirm Order"}</button>
            </aside>
          </form>
        )}

        {msg && <div className="mt-8 rounded-3xl border bg-white p-6 font-black">{msg}</div>}
      </section>
    </main>
  );
}
TSX

cat > src/app/account/page.tsx << 'TSX'
"use client";

import MarketplaceHeader from "@/components/layout/MarketplaceHeader";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await erpGet("customerOrders", { shopId: CONFIG.defaultShopId, email });
    if (res.success) setOrders(res.orders || []);
    else setMsg(res.message);
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <MarketplaceHeader />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-900">Customer Account</p>
          <h1 className="mt-3 text-4xl font-black">Order History</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <input value={email} onChange={e=>setEmail(e.target.value)} className="min-w-[260px] flex-1 rounded-full border px-5 py-3" placeholder="Enter your Gmail" />
            <button onClick={load} className="rounded-full bg-blue-950 px-6 py-3 font-black text-white">Find Orders</button>
          </div>
        </div>

        {msg && <p className="mt-4 font-bold text-red-600">{msg}</p>}

        <div className="mt-6 grid gap-4">
          {orders.map(o => (
            <a href={`/orders/${o["Order ID"]}`} key={o["Order ID"]} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-900">Order</p>
                  <h2 className="mt-2 text-2xl font-black">{o["Order ID"]}</h2>
                </div>
                <div className="text-right">
                  <p className="font-black">{o["Grand Total"]} MMK</p>
                  <p className="text-sm text-slate-500">{o["Order Status"]} • {o["Payment Status"]}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
TSX

cat > src/app/partner/dashboard/page.tsx << 'TSX'
"use client";

import MarketplaceHeader from "@/components/layout/MarketplaceHeader";
import ProfessionalDataTable from "@/components/admin/ProfessionalDataTable";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

export default function PartnerDashboardPage() {
  const [partnerId, setPartnerId] = useState("");
  const [data, setData] = useState<any>(null);

  async function load() {
    const res = await erpGet("partnerDashboard", { shopId: CONFIG.defaultShopId, partnerId });
    setData(res);
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <MarketplaceHeader />
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-900">Partner Portal</p>
          <h1 className="mt-3 text-4xl font-black">Settlement Dashboard</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <input value={partnerId} onChange={e=>setPartnerId(e.target.value)} className="min-w-[260px] flex-1 rounded-full border px-5 py-3" placeholder="Partner ID" />
            <button onClick={load} className="rounded-full bg-blue-950 px-6 py-3 font-black text-white">Open Dashboard</button>
          </div>
        </div>

        {data?.dashboard && (
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {Object.entries(data.dashboard).map(([k,v]) => <div key={k} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-bold text-slate-500">{k}</p><p className="mt-2 text-2xl font-black">{String(v)}</p></div>)}
          </div>
        )}

        {data?.commissions && <div className="mt-6"><ProfessionalDataTable rows={data.commissions} title="Partner Commission Settlement" /></div>}
      </section>
    </main>
  );
}
TSX

python3 << 'PY'
from pathlib import Path

admin_pages = {
  "documents": "documents",
  "notifications": "notifications",
  "activity-logs": "activityLogs",
  "audit-logs": "auditLogs",
  "coupons": "coupons",
  "reviews": "reviews",
}

for folder, action in admin_pages.items():
    p = Path(f"src/app/admin/{folder}/page.tsx")
    p.write_text(f'''"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminPageShell from "@/components/admin/AdminPageShell";
import ProfessionalDataTable from "@/components/admin/ProfessionalDataTable";
import {{ erpGet }} from "@/lib/api";
import {{ CONFIG }} from "@/lib/config";
import {{ useEffect, useState }} from "react";

export default function Page() {{
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {{
    erpGet("{action}", {{ shopId: CONFIG.defaultShopId }}).then((res) => {{
      const firstArray = Object.values(res).find((v) => Array.isArray(v)) as any[];
      setRows(firstArray || []);
    }});
  }}, []);

  return (
    <AdminLayout>
      <AdminPageShell title="{folder.replace("-", " ").title()}" description="Search, filter, view and manage {folder.replace("-", " ")} records.">
        <ProfessionalDataTable rows={{rows}} title="{folder.replace("-", " ").title()}" />
      </AdminPageShell>
    </AdminLayout>
  );
}}
''')

p = Path("src/app/admin/analytics/page.tsx")
p.write_text('''"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminPageShell from "@/components/admin/AdminPageShell";
import FinanceMiniCharts from "@/components/charts/FinanceMiniCharts";
import RecentActivityWidget from "@/components/widgets/RecentActivityWidget";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [d, setD] = useState<any>({});

  useEffect(() => {
    erpGet("dashboard", { shopId: CONFIG.defaultShopId }).then((res) => setD(res.dashboard || {}));
  }, []);

  return (
    <AdminLayout>
      <AdminPageShell title="Analytics" description="Revenue, inventory, activity and performance overview.">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <FinanceMiniCharts data={d} />
          <RecentActivityWidget />
        </div>
      </AdminPageShell>
    </AdminLayout>
  );
}
''')
PY

echo "✅ Professional UI/UX upgrade applied"
npm run build
