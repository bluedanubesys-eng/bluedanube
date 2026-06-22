import { CONFIG } from "./config";

export async function erpPost(data: Record<string, unknown>) {
  if (!CONFIG.appsScriptUrl) return { success: false, message: "Apps Script URL not configured" };
  const res = await fetch(CONFIG.appsScriptUrl, { method: "POST", body: JSON.stringify(data) });
  return res.json();
}

export async function erpGet(action: string, params: Record<string, string> = {}) {
  if (!CONFIG.appsScriptUrl) return { success: false, message: "Apps Script URL not configured" };
  const url = new URL(CONFIG.appsScriptUrl);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { cache: "no-store" });
  return res.json();
}
