#!/usr/bin/env bash
set -e

mkdir -p src/components/layout src/components/marketplace src/app/brands/[brand]

cat > src/components/layout/MarketplaceHeader.tsx << 'TSX'
"use client";

import { useEffect, useState } from "react";
import { getCart } from "@/services/cart.service";

export default function MarketplaceHeader() {
  const [cartCount, setCartCount] = useState(0);

  function loadCart() {
    setCartCount(getCart().reduce((s, i) => s + i.qty, 0));
  }

  useEffect(() => {
    loadCart();
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, []);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-[#071b46] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-semibold">
          <p>European products curated for Myanmar customers</p>
          <div className="flex gap-4">
            <a href="/account">Track Order</a>
            <a href="/partner">Sell With Us</a>
            <a href="/login">Admin</a>
          </div>
        </div>
      </div>

      <div className="bg-[#0b255c] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <a href="/" className="text-2xl font-black tracking-tight">
            Blue Danube
          </a>

          <div className="hidden flex-1 md:block">
            <input
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 outline-none ring-2 ring-transparent focus:ring-amber-300"
              placeholder="Search European products, brands, categories..."
            />
          </div>

          <nav className="flex items-center gap-3 text-sm font-bold">
            <a href="/shop" className="hidden rounded-full px-4 py-2 hover:bg-white/10 sm:block">Shop</a>
            <a href="/account" className="hidden rounded-full px-4 py-2 hover:bg-white/10 md:block">Orders</a>
            <a href="/cart" className="rounded-full bg-amber-400 px-5 py-2 text-[#071b46]">
              Cart {cartCount > 0 ? `(${cartCount})` : ""}
            </a>
          </nav>
        </div>
      </div>

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 text-sm font-black text-slate-700">
          {["All", "New Arrivals", "Fashion", "Shoes", "Bags", "Accessories", "Beauty", "Lifestyle", "Deals"].map((x) => (
            <a key={x} href="/shop" className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-2 hover:bg-[#0b255c] hover:text-white">
              {x}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
TSX

cat > src/components/marketplace/ProductCard.tsx << 'TSX'
"use client";

import { addToCart } from "@/services/cart.service";
import { getProductImage } from "@/services/product.service";
import type { Product } from "@/types/product";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";

export default function ProductCard({ product }: { product: Product }) {
  const img = getProductImage(product);
  const stock = Number(product["Stock Qty"] || 0);
  const price = Number(product["Selling Price"] || 0);

  async function wishlist() {
    const email = prompt("Enter your Gmail for wishlist");
    if (!email) return;

    await erpPost({
      action: "createWishlist",
      shopId: CONFIG.defaultShopId,
      email,
      productId: product["Product ID"],
      productName: product["Product Name"],
    });

    alert("Added to wishlist");
  }

  return (
    <article className="group overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square bg-slate-100">
        <a href={`/shop/${product["Product ID"]}`}>
          {img ? (
            <img
              src={img}
              alt={product["Product Name"] || ""}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-bold text-slate-400">
              No Image
            </div>
          )}
        </a>

        <button
          onClick={wishlist}
          className="absolute right-3 top-3 rounded-full bg-white px-3 py-2 text-sm font-black shadow"
        >
          ♥
        </button>

        <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-[#071b46] shadow">
          New
        </span>

        {stock <= 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-5">
        <a href={`/brands/${encodeURIComponent(product.Brand || "European Brand")}`}>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0b255c] hover:underline">
            {product.Brand || "European Brand"}
          </p>
        </a>

        <a href={`/shop/${product["Product ID"]}`}>
          <h3 className="mt-2 line-clamp-2 min-h-[48px] text-lg font-black hover:text-[#0b255c]">
            {product["Product Name"]}
          </h3>
        </a>

        <p className="mt-1 text-sm text-slate-500">{product.Category || "Product"}</p>

        <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>★ 4.8</span>
          <span>{stock} in stock</span>
        </div>

        <p className="mt-4 text-2xl font-black text-[#0b255c]">
          {price.toLocaleString()} MMK
        </p>

        <button
          disabled={stock <= 0}
          onClick={() => addToCart(product)}
          className="mt-5 w-full rounded-full bg-[#0b255c] px-5 py-3 font-black text-white transition hover:bg-[#14377d] disabled:bg-slate-300"
        >
          {stock > 0 ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}
TSX

cat > src/app/page.tsx << 'TSX'
import MarketplaceHeader from "@/components/layout/MarketplaceHeader";

const categories = [
  ["Fashion", "Elegant European clothing"],
  ["Shoes", "Daily comfort and style"],
  ["Bags", "Premium accessories"],
  ["Lifestyle", "Selected everyday essentials"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <MarketplaceHeader />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#071b46] via-[#0b255c] to-[#122f72] p-10 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">
              Blue Danube Marketplace
            </p>
            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              European premium products for Myanmar customers.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Curated fashion, bags, shoes, accessories and lifestyle products with local order support.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/shop" className="rounded-full bg-amber-400 px-8 py-4 font-black text-[#071b46]">
                Shop Collection
              </a>
              <a href="/partner" className="rounded-full border border-white/30 px-8 py-4 font-black text-white">
                Become a Partner
              </a>
            </div>
          </div>

          <div className="grid gap-6">
            <a href="/shop" className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0b255c]">New Arrivals</p>
              <h2 className="mt-4 text-3xl font-black">Fresh European selections</h2>
              <p className="mt-3 text-slate-500">Discover curated products newly added to Blue Danube.</p>
            </a>

            <a href="/partner" className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0b255c]">Partner Program</p>
              <h2 className="mt-4 text-3xl font-black">Sell with Blue Danube</h2>
              <p className="mt-3 text-slate-500">Consignment and sales partner support with ERP reports.</p>
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {categories.map(([title, text]) => (
            <a
              key={title}
              href="/shop"
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 h-28 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200" />
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0b255c]">Why Blue Danube</p>
              <h2 className="mt-3 text-3xl font-black">A refined shopping experience</h2>
            </div>
            <a href="/shop" className="rounded-full bg-[#0b255c] px-6 py-3 font-black text-white">Browse Shop</a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              ["Authentic sourcing", "Selected European products"],
              ["Local payment", "KBZ Pay, Wave Pay and bank transfer"],
              ["Order tracking", "Status updates from order to delivery"],
              ["Partner support", "Commission and settlement reports"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
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

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#071b46] to-[#0b255c] p-8 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">Blue Danube Shop</p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">European products collection</h1>
          <p className="mt-4 max-w-2xl text-blue-100">Browse real products from Blue Danube ERP database.</p>

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
    </main>
  );
}
TSX

cat > src/app/brands/[brand]/page.tsx << 'TSX'
"use client";

import MarketplaceHeader from "@/components/layout/MarketplaceHeader";
import ProductCard from "@/components/marketplace/ProductCard";
import { getProducts } from "@/services/product.service";
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
    <main className="min-h-screen bg-[#f5f6f8]">
      <MarketplaceHeader />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="font-black uppercase tracking-[0.25em] text-[#0b255c]">Brand Collection</p>
          <h1 className="mt-3 text-4xl font-black">{brand}</h1>
          <p className="mt-3 text-slate-500">{products.length} products from this brand.</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p["Product ID"]} product={p} />)}
        </div>
      </section>
    </main>
  );
}
TSX

npm run build
