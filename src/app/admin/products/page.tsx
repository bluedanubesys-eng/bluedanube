"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { fileToBase64 } from "@/lib/file";
import { useState } from "react";
import ProductTable from "@/components/tables/ProductTable";

export default function ProductsPage() {
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const f = new FormData(e.currentTarget);
    const file = f.get("image") as File;

    const imageBase64 =
      file && file.size > 0 ? await fileToBase64(file) : "";

    const res = await erpPost({
      action: "createProductWithImage",
      shopId: CONFIG.defaultShopId,
      productName: f.get("productName"),
      brand: f.get("brand"),
      category: f.get("category"),
      description: f.get("description"),
      costPrice: Number(f.get("costPrice") || 0),
      importCost: Number(f.get("importCost") || 0),
      sellingPrice: Number(f.get("sellingPrice") || 0),
      stockQty: Number(f.get("stockQty") || 0),
      reorderLevel: Number(f.get("reorderLevel") || 0),
      size: f.get("size"),
      color: f.get("color"),
      ownerType: f.get("ownerType"),
      partnerId: f.get("partnerId"),
      imageBase64,
      imageName: file && file.size > 0 ? file.name : "",
    });

    setMsg(res.success ? `Product created successfully: ${res.productId}` : res.message);
    setLoading(false);
  }

  async function previewImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview("");
      return;
    }

    const base64 = await fileToBase64(file);
    setPreview(base64);
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold">Products</h1>
      <p className="mt-2 text-slate-600">
        Create Blue Danube products with Google Drive image upload.
      </p>

      <form
        onSubmit={submit}
        className="mt-8 grid max-w-6xl gap-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <div>
            <label className="block text-sm font-bold text-slate-700">
              Product Image
            </label>

            <div className="mt-3 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border bg-slate-100">
              {preview ? (
                <img
                  src={preview}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm text-slate-400">No image selected</span>
              )}
            </div>

            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={previewImage}
              className="mt-4 w-full rounded-xl border px-4 py-3 text-sm"
            />
          </div>

          <div className="grid gap-4">
            <input
              name="productName"
              required
              placeholder="Product Name"
              className="rounded-xl border px-4 py-3"
            />

            <textarea
              name="description"
              placeholder="Description"
              className="min-h-28 rounded-xl border px-4 py-3"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="brand"
                placeholder="Brand"
                className="rounded-xl border px-4 py-3"
              />
              <input
                name="category"
                placeholder="Category"
                className="rounded-xl border px-4 py-3"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <input
                name="costPrice"
                type="number"
                placeholder="Cost Price"
                className="rounded-xl border px-4 py-3"
              />
              <input
                name="importCost"
                type="number"
                placeholder="Import Cost"
                className="rounded-xl border px-4 py-3"
              />
              <input
                name="sellingPrice"
                type="number"
                placeholder="Selling Price"
                className="rounded-xl border px-4 py-3"
              />
              <input
                name="stockQty"
                type="number"
                placeholder="Stock Qty"
                className="rounded-xl border px-4 py-3"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <input
                name="reorderLevel"
                type="number"
                placeholder="Reorder Level"
                className="rounded-xl border px-4 py-3"
              />
              <input
                name="size"
                placeholder="Size"
                className="rounded-xl border px-4 py-3"
              />
              <input
                name="color"
                placeholder="Color"
                className="rounded-xl border px-4 py-3"
              />
              <input
                name="partnerId"
                placeholder="Partner ID optional"
                className="rounded-xl border px-4 py-3"
              />
            </div>

            <select
              name="ownerType"
              className="rounded-xl border px-4 py-3"
            >
              <option>Blue Danube</option>
              <option>Consignment Partner</option>
            </select>

            <button
              disabled={loading}
              className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Uploading & Saving..." : "Create Product"}
            </button>

            {msg && <p className="font-semibold">{msg}</p>}
          </div>
        </div>
      </form>
    <ProductTable />
    </AdminLayout>
  );
}
