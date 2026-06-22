"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

export default function ProductsPage() {
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const res = await erpPost({
      action: "createProduct",
      shopId: CONFIG.defaultShopId,
      productName: f.get("productName"),
      brand: f.get("brand"),
      category: f.get("category"),
      costPrice: Number(f.get("costPrice") || 0),
      importCost: Number(f.get("importCost") || 0),
      sellingPrice: Number(f.get("sellingPrice") || 0),
      stockQty: Number(f.get("stockQty") || 0),
      size: f.get("size"),
      color: f.get("color"),
      ownerType: f.get("ownerType"),
    });
    setMsg(res.success ? `Created ${res.productId}` : res.message);
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold">Products</h1>
      <form onSubmit={submit} className="mt-8 grid max-w-5xl gap-4 rounded-2xl border bg-white p-6">
        <input name="productName" required placeholder="Product Name" className="rounded-xl border px-4 py-3" />
        <div className="grid gap-4 md:grid-cols-2">
          <input name="brand" placeholder="Brand" className="rounded-xl border px-4 py-3" />
          <input name="category" placeholder="Category" className="rounded-xl border px-4 py-3" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <input name="costPrice" type="number" placeholder="Cost Price" className="rounded-xl border px-4 py-3" />
          <input name="importCost" type="number" placeholder="Import Cost" className="rounded-xl border px-4 py-3" />
          <input name="sellingPrice" type="number" placeholder="Selling Price" className="rounded-xl border px-4 py-3" />
          <input name="stockQty" type="number" placeholder="Stock Qty" className="rounded-xl border px-4 py-3" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <input name="size" placeholder="Size" className="rounded-xl border px-4 py-3" />
          <input name="color" placeholder="Color" className="rounded-xl border px-4 py-3" />
          <select name="ownerType" className="rounded-xl border px-4 py-3"><option>Blue Danube</option><option>Consignment Partner</option></select>
        </div>
        <button className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Create Product</button>
        {msg && <p className="font-semibold">{msg}</p>}
      </form>
    </AdminLayout>
  );
}
