#!/usr/bin/env bash
set -e

cat > src/app/page.tsx << 'TSX'
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <header className="sticky top-0 z-50 bg-[#0f1f4a] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <a href="/" className="text-2xl font-black tracking-tight">Blue Danube</a>
          <div className="hidden flex-1 md:block">
            <input className="w-full rounded-full bg-white px-6 py-3 text-sm text-slate-900 outline-none" placeholder="Search European products, brands, categories..." />
          </div>
          <nav className="flex gap-5 text-sm font-bold">
            <a href="/shop">Shop</a>
            <a href="/cart">Cart</a>
            <a href="/partner">Partner</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f1f4a] via-[#17306f] to-[#07122d] p-10 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">European Marketplace</p>
            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              Premium European products, delivered with local support.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Curated fashion, accessories, shoes, bags and lifestyle items for Myanmar customers.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/shop" className="rounded-full bg-white px-8 py-4 font-black text-[#0f1f4a] shadow-lg">Shop Now</a>
              <a href="/partner" className="rounded-full border border-white/30 px-8 py-4 font-black text-white">Become a Partner</a>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-900">Today Highlight</p>
              <h2 className="mt-4 text-3xl font-black">European Essentials</h2>
              <p className="mt-3 text-slate-500">New arrivals and selected quality products.</p>
              <a href="/shop" className="mt-6 inline-block font-black text-blue-950">Explore collection →</a>
            </div>

            <div className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-900">Partner Program</p>
              <h2 className="mt-4 text-3xl font-black">Sell with Blue Danube</h2>
              <p className="mt-3 text-slate-500">Partner and consignment product support.</p>
              <a href="/partner" className="mt-6 inline-block font-black text-blue-950">Apply now →</a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["Authentic Sourcing", "Selected European products"],
            ["Local Payment", "KBZ Pay, Wave Pay, bank transfer"],
            ["Order Tracking", "Confirmation and delivery updates"],
            ["Partner Sales", "Commission and settlement support"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
TSX

cat > src/app/shop/page.tsx << 'TSX'
"use client";

import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { addToCart } from "@/services/cart.service";
import { getProductImage } from "@/services/product.service";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";

const categories = ["All", "Fashion", "Shoes", "Bags", "Accessories", "Beauty", "Lifestyle"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <header className="sticky top-0 z-50 bg-[#0f1f4a] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-4">
          <a href="/" className="text-2xl font-black">Blue Danube</a>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="hidden flex-1 rounded-full bg-white px-6 py-3 text-sm text-slate-950 outline-none md:block"
            placeholder="Search products, brands, categories..."
          />
          <a href="/cart" className="rounded-full bg-white px-5 py-2 font-black text-[#0f1f4a]">Cart</a>
        </div>
      </header>

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-5 py-2 text-sm font-black ${category === c ? "bg-[#0f1f4a] text-white" : "bg-slate-100 text-slate-700"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#0f1f4a] to-[#07122d] p-8 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">Blue Danube Shop</p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">European Products Collection</h1>
          <p className="mt-4 max-w-2xl text-blue-100">Browse real products from the Blue Danube ERP database.</p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-6 w-full rounded-full bg-white px-6 py-4 text-slate-950 outline-none md:hidden"
            placeholder="Search products..."
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:block">
            <h2 className="text-xl font-black">Filters</h2>
            <div className="mt-6 space-y-5 text-sm">
              <div>
                <p className="font-black">Category</p>
                <div className="mt-3 space-y-2">
                  {categories.map((c) => (
                    <button key={c} onClick={() => setCategory(c)} className="block text-slate-600 hover:text-blue-950">
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-black">Stock</p>
                <p className="mt-2 text-slate-500">Available products only</p>
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

            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="animate-pulse rounded-[1.7rem] bg-white p-4 shadow-sm">
                    <div className="aspect-square rounded-2xl bg-slate-200" />
                    <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            )}

            {!loading && !filtered.length && (
              <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
                <h3 className="text-2xl font-black">No products found</h3>
                <p className="mt-2 text-slate-500">Add products from ERP admin or change your search.</p>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => {
                const img = getProductImage(p);
                const stock = Number(p["Stock Qty"] || 0);

                return (
                  <article key={p["Product ID"]} className="group overflow-hidden rounded-[1.7rem] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-square bg-slate-100">
                      {img ? (
                        <img src={img} alt={p["Product Name"] || ""} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-bold text-slate-400">
                          No Image
                        </div>
                      )}
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-blue-950 shadow">
                        {p.Category || "Product"}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-900">{p.Brand || "European Brand"}</p>
                      <h3 className="mt-2 line-clamp-2 min-h-[48px] text-lg font-black">{p["Product Name"]}</h3>
                      <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>{p.Size || "Standard"}</span>
                        <span>{p.Color || ""}</span>
                      </div>
                      <p className="mt-4 text-2xl font-black text-blue-950">{Number(p["Selling Price"] || 0).toLocaleString()} MMK</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{stock > 0 ? `${stock} in stock` : "Out of stock"}</p>
                      <button
                        disabled={stock <= 0}
                        onClick={() => addToCart(p)}
                        className="mt-5 w-full rounded-full bg-[#0f1f4a] px-5 py-3 font-black text-white transition hover:bg-[#17306f] disabled:bg-slate-300"
                      >
                        {stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </article>
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

echo "✅ Production public UI applied"
npm run dev
