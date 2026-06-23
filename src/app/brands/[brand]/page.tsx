"use client";
import Premium CollectionHeader from "@/components/layout/Premium CollectionHeader";
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
      <Premium CollectionHeader />

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
