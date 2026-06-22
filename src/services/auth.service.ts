import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";

export function getSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("bd_session");
  return raw ? JSON.parse(raw) : null;
}

export function setSession(data: any) {
  localStorage.setItem("bd_session", JSON.stringify(data));
  if (data?.token) {
    document.cookie = `bd_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export function logout() {
  localStorage.removeItem("bd_session");
  document.cookie = "bd_token=; path=/; max-age=0";
  window.location.href = "/login";
}

export async function sendOtp(email: string) {
  return erpPost({ action: "sendGmailVerificationCode", email, shopId: CONFIG.defaultShopId });
}

export async function verifyOtp(email: string, code: string) {
  return erpPost({ action: "verifyGmailCode", email, code, shopId: CONFIG.defaultShopId });
}
