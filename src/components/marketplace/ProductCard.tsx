"use client";
import { successPopup, errorPopup, loadingPopup, closePopup } from "@/lib/popup";

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

    successPopup(String("Added to wishlist"));
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
