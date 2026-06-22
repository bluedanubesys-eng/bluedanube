"use client";

import { addToCart } from "@/services/cart.service";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { getProductImage, getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts().then((items) => {
      setProduct(items.find((p) => p["Product ID"] === id) || null);
    });
  }, [id]);

  if (!product) {
    return <main className="min-h-screen bg-slate-100 p-8 font-bold">Loading product...</main>;
  }

  const img = getProductImage(product);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-[#0f1f4a] text-white">
        <div className="mx-auto flex max-w-7xl justify-between px-6 py-4">
          <a href="/shop" className="text-2xl font-black">Blue Danube</a>
          <a href="/cart" className="font-black">Cart</a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
          {img ? <img src={img} className="aspect-square w-full object-cover" alt={product["Product Name"] || ""} /> : <div className="aspect-square bg-slate-200" />}
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="font-black uppercase tracking-[0.2em] text-blue-900">{product.Brand || "European Brand"}</p>
          <h1 className="mt-4 text-4xl font-black">{product["Product Name"]}</h1>
          <p className="mt-4 text-slate-600">{product.Description || "Premium European product curated by Blue Danube."}</p>
          <p className="mt-8 text-4xl font-black text-blue-950">{Number(product["Selling Price"] || 0).toLocaleString()} MMK</p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4"><b>Size</b><p>{product.Size || "Standard"}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><b>Color</b><p>{product.Color || "-"}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><b>Stock</b><p>{product["Stock Qty"] || 0}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><b>Category</b><p>{product.Category || "-"}</p></div>
          </div>

          <button onClick={() => addToCart(product)} className="mt-8 w-full rounded-full bg-[#0f1f4a] px-6 py-4 font-black text-white">
            Add to Cart
          </button>
          <button onClick={() => erpPost({ action: "createWishlist", shopId: CONFIG.defaultShopId, productId: product["Product ID"], productName: product["Product Name"], email: prompt("Your Gmail") || "" })} className="mt-3 w-full rounded-full border px-6 py-4 font-black">
            Add to Wishlist
          </button>
          <form onSubmit={async e => { e.preventDefault(); const f = new FormData(e.currentTarget); await erpPost({ action: "createReview", shopId: CONFIG.defaultShopId, productId: product["Product ID"], customerName: f.get("name"), rating: f.get("rating"), comment: f.get("comment") }); alert("Review submitted"); }} className="mt-8 grid gap-3">
            <h2 className="text-xl font-black">Write a Review</h2>
            <input name="name" placeholder="Your name" className="rounded-xl border px-4 py-3" />
            <input name="rating" type="number" min="1" max="5" defaultValue="5" className="rounded-xl border px-4 py-3" />
            <textarea name="comment" placeholder="Comment" className="rounded-xl border px-4 py-3" />
            <button className="rounded-xl bg-blue-950 px-4 py-3 font-black text-white">Submit Review</button>
          </form>
        </div>
      </section>
    </main>
  );
}
