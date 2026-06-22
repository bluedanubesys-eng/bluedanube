import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

const KEY = "bd_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product: Product) {
  const items = getCart();
  const id = product["Product ID"];
  const found = items.find(i => i.product["Product ID"] === id);

  if (found) found.qty += 1;
  else items.push({ product, qty: 1 });

  saveCart(items);
}

export function updateQty(productId: string, qty: number) {
  const items = getCart()
    .map(i => i.product["Product ID"] === productId ? { ...i, qty } : i)
    .filter(i => i.qty > 0);

  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + Number(i.product["Selling Price"] || 0) * i.qty, 0);
}
