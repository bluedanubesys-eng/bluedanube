"use client";
import toast from "react-hot-toast";

import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { addToCart } from "@/services/cart.service";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { getProductImage, getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/marketplace/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const id = String(params.id || "");

  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    getProducts().then((items) => {
      setProducts(items);
      const found = items.find((p) => p["Product ID"] === id) || null;
      setProduct(found);
      setActiveImage(found ? getProductImage(found) : "");
    });
  }, [id]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p["Product ID"] !== product["Product ID"])
      .filter((p) => p.Category === product.Category || p.Brand === product.Brand)
      .slice(0, 4);
  }, [products, product]);

  async function wishlist() {
    if (!product) return;
    const email = prompt("Enter your Gmail for wishlist");
    if (!email) return;

    await erpPost({
      action: "createWishlist",
      shopId: CONFIG.defaultShopId,
      productId: product["Product ID"],
      productName: product["Product Name"],
      email,
    });

    toast.success(String("Added to wishlist"));
  }

  async function review(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!product) return;

    const f = new FormData(e.currentTarget);

    await erpPost({
      action: "createReview",
      shopId: CONFIG.defaultShopId,
      productId: product["Product ID"],
      customerName: f.get("name"),
      rating: f.get("rating"),
      comment: f.get("comment"),
    });

    toast.success(String("Review submitted"));
    e.currentTarget.reset();
  }

  if (!product) {
    return (
      <main className="min-h-screen pb-16 md:pb-0 bg-[#f5f6f8] p-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 font-black shadow-sm">
          Loading product...
        </div>
      <MobileBottomNav />
    </main>
    );
  }

  const img = getProductImage(product);
  const gallery = [img, img, img, img].filter(Boolean);
  const stock = Number(product["Stock Qty"] || 0);

  return (
    <main className="min-h-screen pb-16 md:pb-0 bg-[#f5f6f8] text-slate-950">
      <header className="bg-[#071b46] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/shop" className="text-2xl font-black">Blue Danube</a>
          <nav className="flex gap-5 text-sm font-bold">
            <a href="/shop">Shop</a>
            <a href="/cart">Cart</a>
            <a href="/account">Orders</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
              {activeImage ? (
                <img
                  src={activeImage}
                  className="aspect-square w-full object-cover"
                  alt={product["Product Name"] || ""}
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-slate-100 font-bold text-slate-400">
                  No Image
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(g)}
                  className="overflow-hidden rounded-2xl border bg-white p-1"
                >
                  <img src={g} className="aspect-square w-full rounded-xl object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <a
              href={`/brands/${encodeURIComponent(product.Brand || "European Brand")}`}
              className="text-sm font-black uppercase tracking-[0.2em] text-[#0b255c]"
            >
              {product.Brand || "European Brand"}
            </a>

            <h1 className="mt-4 text-4xl font-black leading-tight">
              {product["Product Name"]}
            </h1>

            <p className="mt-4 text-slate-600">
              {product.Description || "Premium product curated by Blue Danube."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-[#071b46]">
                ★ 4.8 Rating
              </span>
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-950">
                {stock > 0 ? `${stock} in stock` : "Out of stock"}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black">
                {product.Category || "Product"}
              </span>
            </div>

            <p className="mt-8 text-4xl font-black text-[#0b255c]">
              {Number(product["Selling Price"] || 0).toLocaleString()} MMK
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <b>Size</b>
                <p>{product.Size || "Standard"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <b>Color</b>
                <p>{product.Color || "-"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <b>SKU</b>
                <p>{product.SKU || "-"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <b>Category</b>
                <p>{product.Category || "-"}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <button
                disabled={stock <= 0}
                onClick={() => addToCart(product)}
                className="flex-1 rounded-full bg-[#0b255c] px-6 py-4 font-black text-white disabled:bg-slate-300"
              >
                Add to Cart
              </button>

              <button
                onClick={wishlist}
                className="rounded-full border px-6 py-4 font-black"
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">Product Details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["Product ID", product["Product ID"]],
                ["Brand", product.Brand],
                ["Category", product.Category],
                ["Size", product.Size],
                ["Color", product.Color],
                ["Status", product.Status],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{k}</p>
                  <p className="font-black">{String(v || "-")}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={review} className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">Write a Review</h2>
            <div className="mt-5 grid gap-3">
              <input name="name" placeholder="Your name" className="rounded-xl border px-4 py-3" />
              <input name="rating" type="number" min="1" max="5" defaultValue="5" className="rounded-xl border px-4 py-3" />
              <textarea name="comment" placeholder="Comment" className="min-h-28 rounded-xl border px-4 py-3" />
              <button className="rounded-xl bg-[#0b255c] px-4 py-3 font-black text-white">
                Submit Review
              </button>
            </div>
          </form>
        </div>

        <div className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0b255c]">
                Related Products
              </p>
              <h2 className="mt-2 text-3xl font-black">You may also like</h2>
            </div>
            <a href="/shop" className="font-black text-[#0b255c]">View all</a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p["Product ID"]} product={p} />
            ))}
          </div>
        </div>
      </section>
    <MobileBottomNav />
    </main>
  );
}
