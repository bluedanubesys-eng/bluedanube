#!/usr/bin/env bash
set -e

mkdir -p src/app/\(auth\)/login src/app/\(auth\)/verify
mkdir -p src/app/admin/{dashboard,products,customers,orders,payments,partners,expenses,reports,settings,users}
mkdir -p src/components/{layout,ui}
mkdir -p src/services src/lib src/constants src/types

cat > src/lib/config.ts << 'TS'
export const CONFIG = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Blue Danube ERP",
  shopName: process.env.NEXT_PUBLIC_SHOP_NAME || "Blue Danube",
  appsScriptUrl: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "",
  defaultShopId: process.env.NEXT_PUBLIC_DEFAULT_SHOP_ID || "SHOP-000001",
};
TS

cat > src/lib/api.ts << 'TS'
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
TS

cat > src/services/auth.service.ts << 'TS'
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";

export function getSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("bd_session");
  return raw ? JSON.parse(raw) : null;
}

export function setSession(data: unknown) {
  localStorage.setItem("bd_session", JSON.stringify(data));
}

export function logout() {
  localStorage.removeItem("bd_session");
  window.location.href = "/login";
}

export async function sendOtp(email: string) {
  return erpPost({ action: "sendGmailVerificationCode", email, shopId: CONFIG.defaultShopId });
}

export async function verifyOtp(email: string, code: string) {
  return erpPost({ action: "verifyGmailCode", email, code, shopId: CONFIG.defaultShopId });
}
TS

cat > src/components/layout/AdminLayout.tsx << 'TSX'
"use client";

import { logout } from "@/services/auth.service";

const menu = [
  ["Dashboard", "/admin/dashboard"],
  ["Products", "/admin/products"],
  ["Customers", "/admin/customers"],
  ["Orders", "/admin/orders"],
  ["Payments", "/admin/payments"],
  ["Partners", "/admin/partners"],
  ["Expenses", "/admin/expenses"],
  ["Reports", "/admin/reports"],
  ["Settings", "/admin/settings"],
  ["Users", "/admin/users"],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white p-5">
        <h1 className="text-xl font-bold text-blue-950">Blue Danube ERP</h1>
        <p className="text-xs text-slate-500">European Marketplace</p>
        <nav className="mt-8 space-y-1">
          {menu.map(([label, href]) => (
            <a key={label} href={href} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-blue-950 hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <button onClick={logout} className="mt-8 w-full rounded-xl border px-4 py-3 text-sm font-semibold">
          Logout
        </button>
      </aside>
      <section className="ml-64 p-6">{children}</section>
    </main>
  );
}
TSX

cat > src/components/ui/Card.tsx << 'TSX'
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border bg-white p-6 shadow-sm">{children}</div>;
}
TSX

cat > src/app/\(auth\)/login/page.tsx << 'TSX'
"use client";

import { sendOtp } from "@/services/auth.service";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await sendOtp(email);
    if (res.success) {
      localStorage.setItem("bd_login_email", email);
      window.location.href = "/verify";
    } else {
      setMsg(res.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Blue Danube ERP</h1>
        <p className="mt-2 text-slate-600">Login with your registered Gmail.</p>
        <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="Gmail" className="mt-6 w-full rounded-xl border px-4 py-3" />
        <button className="mt-4 w-full rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Send Verification Code</button>
        {msg && <p className="mt-4 text-sm font-semibold text-red-600">{msg}</p>}
      </form>
    </main>
  );
}
TSX

cat > src/app/\(auth\)/verify/page.tsx << 'TSX'
"use client";

import { setSession, verifyOtp } from "@/services/auth.service";
import { useState } from "react";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const email = localStorage.getItem("bd_login_email") || "";
    const res = await verifyOtp(email, code);
    if (res.success) {
      setSession(res);
      window.location.href = "/admin/dashboard";
    } else {
      setMsg(res.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Verify Gmail</h1>
        <p className="mt-2 text-slate-600">Enter the 6-digit code sent to your Gmail.</p>
        <input value={code} onChange={e => setCode(e.target.value)} required placeholder="Verification Code" className="mt-6 w-full rounded-xl border px-4 py-3" />
        <button className="mt-4 w-full rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Verify & Login</button>
        {msg && <p className="mt-4 text-sm font-semibold text-red-600">{msg}</p>}
      </form>
    </main>
  );
}
TSX

cat > src/app/admin/dashboard/page.tsx << 'TSX'
"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [d, setD] = useState<any>({});

  useEffect(() => {
    erpGet("dashboard", { shopId: CONFIG.defaultShopId }).then(res => setD(res.dashboard || {}));
  }, []);

  const stats = [
    ["Orders", d.totalOrders || 0],
    ["Revenue", `${d.totalRevenue || 0} MMK`],
    ["Expenses", `${d.totalExpenses || 0} MMK`],
    ["Net Profit", `${d.netProfit || 0} MMK`],
    ["Products", d.totalProducts || 0],
    ["Customers", d.totalCustomers || 0],
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map(([k, v]) => <Card key={k}><p className="text-sm text-slate-500">{k}</p><p className="mt-2 text-2xl font-bold">{v}</p></Card>)}
      </div>
    </AdminLayout>
  );
}
TSX

cat > src/app/admin/products/page.tsx << 'TSX'
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
TSX

cat > src/app/admin/customers/page.tsx << 'TSX'
"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

export default function CustomersPage() {
  const [msg,setMsg]=useState("");
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const r=await erpPost({action:"createCustomer",shopId:CONFIG.defaultShopId,customerName:f.get("customerName"),phone:f.get("phone"),email:f.get("email"),address:f.get("address"),township:f.get("township")});setMsg(r.success?`Created ${r.customerId}`:r.message)}
  return <AdminLayout><h1 className="text-3xl font-bold">Customers</h1><form onSubmit={submit} className="mt-8 grid max-w-3xl gap-4 rounded-2xl border bg-white p-6"><input name="customerName" required placeholder="Customer Name" className="rounded-xl border px-4 py-3"/><input name="phone" placeholder="Phone" className="rounded-xl border px-4 py-3"/><input name="email" placeholder="Email" className="rounded-xl border px-4 py-3"/><input name="address" placeholder="Address" className="rounded-xl border px-4 py-3"/><input name="township" placeholder="Township" className="rounded-xl border px-4 py-3"/><button className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Create Customer</button>{msg&&<p className="font-semibold">{msg}</p>}</form></AdminLayout>
}
TSX

cat > src/app/admin/orders/page.tsx << 'TSX'
"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

export default function OrdersPage(){const[msg,setMsg]=useState("");async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const r=await erpPost({action:"createOrder",shopId:CONFIG.defaultShopId,customerName:f.get("customerName"),phone:f.get("phone"),email:f.get("email"),address:f.get("address"),township:f.get("township"),paymentMethod:f.get("paymentMethod"),deliveryFee:Number(f.get("deliveryFee")||0),discount:Number(f.get("discount")||0),partnerId:f.get("partnerId"),items:[{productId:f.get("productId"),productName:f.get("productName"),qty:Number(f.get("qty")||1),unitPrice:Number(f.get("unitPrice")||0)}]});setMsg(r.success?`Order ${r.orderId} Total ${r.grandTotal} MMK`:r.message)}
return <AdminLayout><h1 className="text-3xl font-bold">Orders</h1><form onSubmit={submit} className="mt-8 grid max-w-5xl gap-4 rounded-2xl border bg-white p-6"><input name="customerName" required placeholder="Customer Name" className="rounded-xl border px-4 py-3"/><input name="phone" placeholder="Phone" className="rounded-xl border px-4 py-3"/><input name="email" placeholder="Email" className="rounded-xl border px-4 py-3"/><input name="address" placeholder="Address" className="rounded-xl border px-4 py-3"/><input name="township" placeholder="Township" className="rounded-xl border px-4 py-3"/><div className="grid gap-4 md:grid-cols-4"><input name="productId" required placeholder="Product ID" className="rounded-xl border px-4 py-3"/><input name="productName" required placeholder="Product Name" className="rounded-xl border px-4 py-3"/><input name="qty" type="number" defaultValue="1" className="rounded-xl border px-4 py-3"/><input name="unitPrice" type="number" placeholder="Unit Price" className="rounded-xl border px-4 py-3"/></div><div className="grid gap-4 md:grid-cols-4"><input name="paymentMethod" placeholder="Payment Method" className="rounded-xl border px-4 py-3"/><input name="deliveryFee" type="number" placeholder="Delivery Fee" className="rounded-xl border px-4 py-3"/><input name="discount" type="number" placeholder="Discount" className="rounded-xl border px-4 py-3"/><input name="partnerId" placeholder="Partner ID" className="rounded-xl border px-4 py-3"/></div><button className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Create Order</button>{msg&&<p className="font-semibold">{msg}</p>}</form></AdminLayout>}
TSX

cat > src/app/admin/payments/page.tsx << 'TSX'
"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";
export default function PaymentsPage(){const[msg,setMsg]=useState("");async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const r=await erpPost({action:"verifyPayment",shopId:CONFIG.defaultShopId,orderId:f.get("orderId"),customerName:f.get("customerName"),amount:Number(f.get("amount")||0),paymentMethod:f.get("paymentMethod"),verifiedBy:"Admin"});setMsg(r.success?`Payment ${r.paymentId}`:r.message)}return <AdminLayout><h1 className="text-3xl font-bold">Payments</h1><form onSubmit={submit} className="mt-8 grid max-w-3xl gap-4 rounded-2xl border bg-white p-6"><input name="orderId" required placeholder="Order ID" className="rounded-xl border px-4 py-3"/><input name="customerName" placeholder="Customer Name" className="rounded-xl border px-4 py-3"/><input name="amount" type="number" required placeholder="Amount" className="rounded-xl border px-4 py-3"/><input name="paymentMethod" placeholder="Payment Method" className="rounded-xl border px-4 py-3"/><button className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Verify Payment</button>{msg&&<p className="font-semibold">{msg}</p>}</form></AdminLayout>}
TSX

cat > src/app/admin/partners/page.tsx << 'TSX'
"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";
export default function PartnersPage(){const[msg,setMsg]=useState("");async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const r=await erpPost({action:"createPartner",shopId:CONFIG.defaultShopId,partnerName:f.get("partnerName"),partnerType:f.get("partnerType"),phone:f.get("phone"),email:f.get("email"),commissionPercent:Number(f.get("commissionPercent")||0)});setMsg(r.success?`Partner ${r.partnerId}`:r.message)}return <AdminLayout><h1 className="text-3xl font-bold">Partners</h1><form onSubmit={submit} className="mt-8 grid max-w-3xl gap-4 rounded-2xl border bg-white p-6"><input name="partnerName" required placeholder="Partner Name" className="rounded-xl border px-4 py-3"/><select name="partnerType" className="rounded-xl border px-4 py-3"><option>Sales Partner</option><option>Consignment Partner</option></select><input name="phone" placeholder="Phone" className="rounded-xl border px-4 py-3"/><input name="email" placeholder="Email" className="rounded-xl border px-4 py-3"/><input name="commissionPercent" type="number" placeholder="Commission %" className="rounded-xl border px-4 py-3"/><button className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Create Partner</button>{msg&&<p className="font-semibold">{msg}</p>}</form></AdminLayout>}
TSX

cat > src/app/admin/expenses/page.tsx << 'TSX'
"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";
export default function ExpensesPage(){const[msg,setMsg]=useState("");async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const r=await erpPost({action:"createExpense",shopId:CONFIG.defaultShopId,category:f.get("category"),description:f.get("description"),amount:Number(f.get("amount")||0),paymentMethod:f.get("paymentMethod")});setMsg(r.success?`Expense ${r.expenseId}`:r.message)}return <AdminLayout><h1 className="text-3xl font-bold">Expenses</h1><form onSubmit={submit} className="mt-8 grid max-w-3xl gap-4 rounded-2xl border bg-white p-6"><input name="category" required placeholder="Category" className="rounded-xl border px-4 py-3"/><input name="description" placeholder="Description" className="rounded-xl border px-4 py-3"/><input name="amount" type="number" placeholder="Amount" className="rounded-xl border px-4 py-3"/><input name="paymentMethod" placeholder="Payment Method" className="rounded-xl border px-4 py-3"/><button className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">Create Expense</button>{msg&&<p className="font-semibold">{msg}</p>}</form></AdminLayout>}
TSX

cat > src/app/admin/reports/page.tsx << 'TSX'
"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";
export default function ReportsPage(){const[msg,setMsg]=useState("");async function run(action:string,reportType?:string){const r=await erpPost({action,shopId:CONFIG.defaultShopId,reportType});if(r.url){setMsg(r.url);window.open(r.url,"_blank")}else setMsg(JSON.stringify(r.report||r,null,2))}return <AdminLayout><h1 className="text-3xl font-bold">Reports</h1><div className="mt-8 grid gap-4 md:grid-cols-3">{[["Profit & Loss","getProfitLossReport"],["Inventory Valuation","getInventoryValuationReport"],["Partner Performance","getPartnerPerformanceReport"],["Export Orders CSV","exportReportCsv","orders"],["Export Products CSV","exportReportCsv","products"],["Backup","exportBackup"]].map((x:any)=><button key={x[0]} onClick={()=>run(x[1],x[2])} className="rounded-2xl border bg-white p-6 text-left font-bold shadow-sm">{x[0]}</button>)}</div>{msg&&<pre className="mt-8 overflow-auto rounded-2xl bg-slate-950 p-6 text-sm text-white">{msg}</pre>}</AdminLayout>}
TSX

for page in brands categories settings users; do
cat > src/app/admin/$page/page.tsx << TSX
import AdminLayout from "@/components/layout/AdminLayout";
export default function Page(){return <AdminLayout><h1 className="text-3xl font-bold capitalize">$page</h1><div className="mt-8 rounded-2xl border bg-white p-6">Blue Danube ERP $page module.</div></AdminLayout>}
TSX
done

npm run dev
