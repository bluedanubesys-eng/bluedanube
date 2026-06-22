import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const res = await erpGet("products", { shopId: CONFIG.defaultShopId });
  return res.success ? res.products || [] : [];
}

export function getProductImage(product: Product) {
  const url = product["Image URL"] || "";

  if (!url) return "";

  const match = String(url).match(/\/d\/([^/]+)/);
  if (match?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  return String(url);
}
