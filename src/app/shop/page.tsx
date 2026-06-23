"use client";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
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
    <main className="min-h-screen pb-16 md:pb-0 bg-[#f5f6f8] text-slate-950">
      <MarketplaceHeader />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#071b46] to-[#0b255c] p-8 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">Blue Danube Shop</p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">European products collection</h1>
          <p className="mt-4 max-w-2xl text-blue-100">Browse real products from Blue Danube database.</p>

          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="mt-6 w-full rounded-full bg-white px-6 py-4 text-slate-950 outline-none"
            placeholder="Search products, brands, categories..."
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:block">
            <h2 className="text-xl font-black">Filters</h2>

            <div className="mt-6">
              <p className="font-black">Category</p>
              <div className="mt-3 space-y-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setPage(1);
                    }}
                    className={`block rounded-full px-4 py-2 text-sm font-bold ${
                      category === c ? "bg-[#0b255c] text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="font-black">Price</p>
              <p className="mt-2 text-sm text-slate-500">Sort by price using the dropdown.</p>
            </div>

            <div className="mt-7 rounded-2xl bg-amber-50 p-4">
              <p className="font-black text-[#0b255c]">Local support</p>
              <p className="mt-2 text-sm text-slate-600">Order confirmation, payment verification and delivery coordination.</p>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">Recommended products</h2>
                <p className="text-sm font-semibold text-slate-500">{filtered.length} items available</p>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border bg-white px-5 py-3 text-sm font-bold"
              >
                <option value="popular">Sort: Popular</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>

            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1,2,3,4,5,6,7,8].map((i) => (
                  <div key={i} className="animate-pulse rounded-[1.6rem] bg-white p-4 shadow-sm">
                    <div className="aspect-square rounded-2xl bg-slate-200" />
                    <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            )}

            {!loading && !current.length && (
              <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
                <h3 className="text-2xl font-black">No products found</h3>
                <p className="mt-2 text-slate-500">Add products from ERP admin or change your search.</p>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {current.map((p) => <ProductCard key={p["Product ID"]} product={p} />)}
            </div>

            {filtered.length > perPage && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-full border bg-white px-5 py-3 font-black disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-black">Page {page} / {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-full border bg-white px-5 py-3 font-black disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    <MobileBottomNav />
    </main>
  );
}
