#!/usr/bin/env bash
set -e

cat > middleware.ts << 'TS'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("bd_token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
TS

python3 << 'PY'
from pathlib import Path
p = Path("src/services/auth.service.ts")
code = p.read_text()
code = code.replace(
'''export function setSession(data: unknown) {
  localStorage.setItem("bd_session", JSON.stringify(data));
}''',
'''export function setSession(data: any) {
  localStorage.setItem("bd_session", JSON.stringify(data));
  if (data?.token) {
    document.cookie = `bd_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
  }
}'''
)
code = code.replace(
'''export function logout() {
  localStorage.removeItem("bd_session");
  window.location.href = "/login";
}''',
'''export function logout() {
  localStorage.removeItem("bd_session");
  document.cookie = "bd_token=; path=/; max-age=0";
  window.location.href = "/login";
}'''
)
p.write_text(code)
PY

python3 << 'PY'
from pathlib import Path
p = Path("backend/Code.gs")
code = p.read_text()

if 'if (action === "customerOrders")' not in code:
    code = code.replace(
'''    if (action === "backups") return getByShop(SHEETS.backups, shopId, "backups");''',
'''    if (action === "backups") return getByShop(SHEETS.backups, shopId, "backups");
    if (action === "customerOrders") return getCustomerOrders(p.email, shopId);
    if (action === "partnerDashboard") return getPartnerDashboard(p.partnerId, shopId);'''
    )

if 'wishlists: "Wishlists"' not in code:
    code = code.replace(
'''  emailVerifications: "EmailVerifications"''',
'''  emailVerifications: "EmailVerifications",
  wishlists: "Wishlists",
  reviews: "Reviews",
  coupons: "Coupons"'''
    )

if 'SHEETS.wishlists' not in code:
    code = code.replace(
'''  createSheet(SHEETS.emailVerifications, [
    "Created At","Shop ID","Email","Code","Expiry","Verified","Verified At","Purpose"
  ]);''',
'''  createSheet(SHEETS.emailVerifications, [
    "Created At","Shop ID","Email","Code","Expiry","Verified","Verified At","Purpose"
  ]);

  createSheet(SHEETS.wishlists, [
    "Created At","Shop ID","Wishlist ID","Customer Email","Product ID","Product Name","Status"
  ]);

  createSheet(SHEETS.reviews, [
    "Created At","Shop ID","Review ID","Product ID","Customer Name","Rating","Comment","Status"
  ]);

  createSheet(SHEETS.coupons, [
    "Created At","Shop ID","Coupon Code","Discount Type","Discount Value","Start Date","End Date","Status"
  ]);'''
    )

if 'if (action === "createWishlist")' not in code:
    code = code.replace(
'''    if (action === "getPartnerSettlementReport") return getPartnerSettlementReport(data);
    if (action === "getImportCostAnalysis") return getImportCostAnalysis(data);''',
'''    if (action === "getPartnerSettlementReport") return getPartnerSettlementReport(data);
    if (action === "getImportCostAnalysis") return getImportCostAnalysis(data);

    if (action === "createWishlist") return createWishlist(data);
    if (action === "createReview") return createReview(data);
    if (action === "createCoupon") return createCoupon(data);'''
    )

extra = r'''

/* ======================================================
   FRONTEND PRODUCTION SUPPORT
====================================================== */

function getCustomerOrders(email, shopId) {
  const target = String(email || "").trim().toLowerCase();
  if (!target) return json({ success: false, message: "Email required" });

  const orders = getSheetDataArray(SHEETS.orders)
    .filter(r =>
      String(r["Shop ID"]) === String(shopId || DEFAULT_SHOP_ID) &&
      String(r.Email || r.email || "").trim().toLowerCase() === target
    );

  return json({ success: true, orders });
}

function getPartnerDashboard(partnerId, shopId) {
  if (!partnerId) return json({ success: false, message: "Partner ID required" });

  const partner = findRowObject(SHEETS.partners, "Partner ID", partnerId);
  const commissions = getSheetDataArray(SHEETS.partnerCommissions)
    .filter(r =>
      String(r["Shop ID"]) === String(shopId || DEFAULT_SHOP_ID) &&
      String(r["Partner ID"]) === String(partnerId)
    );

  const totalSales = commissions.reduce((s, r) => s + Number(r["Sale Amount"] || 0), 0);
  const totalCommission = commissions.reduce((s, r) => s + Number(r["Commission Amount"] || 0), 0);
  const paidCommission = commissions
    .filter(r => String(r.Status).toLowerCase() === "paid")
    .reduce((s, r) => s + Number(r["Commission Amount"] || 0), 0);

  return json({
    success: true,
    partner,
    dashboard: {
      totalOrders: commissions.length,
      totalSales,
      totalCommission,
      paidCommission,
      unpaidCommission: totalCommission - paidCommission
    },
    commissions
  });
}

function createWishlist(data) {
  const wishlistId = generateId("WISH", SHEETS.wishlists);
  getSheet(SHEETS.wishlists).appendRow([
    new Date(),
    data.shopId || DEFAULT_SHOP_ID,
    wishlistId,
    data.email || "",
    data.productId || "",
    data.productName || "",
    "Active"
  ]);
  return json({ success: true, wishlistId });
}

function createReview(data) {
  const reviewId = generateId("REV", SHEETS.reviews);
  getSheet(SHEETS.reviews).appendRow([
    new Date(),
    data.shopId || DEFAULT_SHOP_ID,
    reviewId,
    data.productId || "",
    data.customerName || "",
    Number(data.rating || 5),
    data.comment || "",
    "Pending"
  ]);
  return json({ success: true, reviewId });
}

function createCoupon(data) {
  getSheet(SHEETS.coupons).appendRow([
    new Date(),
    data.shopId || DEFAULT_SHOP_ID,
    data.couponCode || "",
    data.discountType || "Amount",
    Number(data.discountValue || 0),
    data.startDate || "",
    data.endDate || "",
    "Active"
  ]);
  return json({ success: true, couponCode: data.couponCode });
}
'''
if 'function getCustomerOrders(email, shopId)' not in code:
    code += extra

p.write_text(code)
print("✅ Backend production support patched")
PY

mkdir -p src/app/shop/[id] src/app/account src/app/partner/dashboard src/app/admin/{documents,notifications,activity-logs,audit-logs,analytics,coupons,reviews}

cat > src/app/shop/[id]/page.tsx << 'TSX'
"use client";

import { addToCart } from "@/services/cart.service";
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
        </div>
      </section>
    </main>
  );
}
TSX

cat > src/app/account/page.tsx << 'TSX'
"use client";

import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await erpGet("customerOrders", { shopId: CONFIG.defaultShopId, email });
    if (res.success) setOrders(res.orders || []);
    else setMsg(res.message);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-[#0f1f4a] text-white"><div className="mx-auto max-w-7xl px-6 py-4 text-2xl font-black">Blue Danube Account</div></header>
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black">Order History</h1>
          <div className="mt-5 flex gap-3">
            <input value={email} onChange={e=>setEmail(e.target.value)} className="flex-1 rounded-xl border px-4 py-3" placeholder="Your Gmail" />
            <button onClick={load} className="rounded-xl bg-blue-950 px-6 py-3 font-black text-white">Find Orders</button>
          </div>
        </div>
        {msg && <p className="mt-4 font-bold text-red-600">{msg}</p>}
        <div className="mt-6 space-y-4">
          {orders.map(o => (
            <div key={o["Order ID"]} className="rounded-3xl bg-white p-5 shadow-sm">
              <b>{o["Order ID"]}</b>
              <p>{o["Order Status"]} • {o["Payment Status"]}</p>
              <p className="font-black">{o["Grand Total"]} MMK</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
TSX

cat > src/app/partner/dashboard/page.tsx << 'TSX'
"use client";

import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";

export default function PartnerDashboardPage() {
  const [partnerId, setPartnerId] = useState("");
  const [data, setData] = useState<any>(null);

  async function load() {
    const res = await erpGet("partnerDashboard", { shopId: CONFIG.defaultShopId, partnerId });
    setData(res);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-[#0f1f4a] text-white"><div className="mx-auto max-w-7xl px-6 py-4 text-2xl font-black">Partner Dashboard</div></header>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black">Partner Settlement</h1>
          <div className="mt-5 flex gap-3">
            <input value={partnerId} onChange={e=>setPartnerId(e.target.value)} className="flex-1 rounded-xl border px-4 py-3" placeholder="Partner ID" />
            <button onClick={load} className="rounded-xl bg-blue-950 px-6 py-3 font-black text-white">Open</button>
          </div>
        </div>
        {data?.dashboard && (
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {Object.entries(data.dashboard).map(([k,v]) => <div key={k} className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-black">{String(v)}</p></div>)}
          </div>
        )}
      </section>
    </main>
  );
}
TSX

cat > src/components/charts/FinanceMiniCharts.tsx << 'TSX'
"use client";

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function FinanceMiniCharts({ data }: { data: any }) {
  const chart = [
    { name: "Revenue", value: Number(data?.totalRevenue || 0) },
    { name: "Expenses", value: Number(data?.totalExpenses || 0) },
    { name: "Profit", value: Number(data?.netProfit || 0) },
    { name: "Inventory", value: Number(data?.inventoryValue || 0) },
  ];

  return (
    <div className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Finance Overview</h2>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
TSX

python3 << 'PY'
from pathlib import Path
p = Path("src/app/admin/dashboard/page.tsx")
code = p.read_text()
if 'FinanceMiniCharts' not in code:
    code = code.replace('import { useEffect, useState } from "react";', 'import { useEffect, useState } from "react";\nimport FinanceMiniCharts from "@/components/charts/FinanceMiniCharts";')
    code = code.replace('</AdminLayout>', '<FinanceMiniCharts data={d} />\n    </AdminLayout>')
p.write_text(code)
PY

for page in documents notifications activity-logs audit-logs analytics coupons reviews; do
cat > src/app/admin/$page/page.tsx << TSX
"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const actionMap: any = {
      "documents": "documents",
      "notifications": "notifications",
      "activity-logs": "activityLogs",
      "audit-logs": "auditLogs",
      "analytics": "dashboard",
      "coupons": "coupons",
      "reviews": "reviews"
    };
    erpGet(actionMap["$page"] || "$page", { shopId: CONFIG.defaultShopId }).then((res) => {
      const firstArray = Object.values(res).find((v) => Array.isArray(v)) as any[];
      setRows(firstArray || []);
    });
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black capitalize">$page</h1>
      <div className="mt-8 overflow-auto rounded-3xl border bg-white p-6 shadow-sm">
        <pre className="text-sm">{JSON.stringify(rows, null, 2)}</pre>
      </div>
    </AdminLayout>
  );
}
TSX
done

python3 << 'PY'
from pathlib import Path
p = Path("src/components/layout/AdminLayout.tsx")
code = p.read_text()
more = '''  ["Documents", "/admin/documents"],
  ["Notifications", "/admin/notifications"],
  ["Activity Logs", "/admin/activity-logs"],
  ["Audit Logs", "/admin/audit-logs"],
  ["Analytics", "/admin/analytics"],
  ["Coupons", "/admin/coupons"],
  ["Reviews", "/admin/reviews"],'''
if '"/admin/documents"' not in code:
    code = code.replace('  ["Users", "/admin/users"],', '  ["Users", "/admin/users"],\n' + more)
p.write_text(code)
PY

python3 << 'PY'
from pathlib import Path
p = Path("src/app/shop/page.tsx")
code = p.read_text()
if 'href={`/shop/${p["Product ID"]}`}' not in code:
    code = code.replace(
'''<h3 className="mt-2 line-clamp-2 min-h-[48px] text-lg font-black">{p["Product Name"]}</h3>''',
'''<a href={`/shop/${p["Product ID"]}`}>
                        <h3 className="mt-2 line-clamp-2 min-h-[48px] text-lg font-black hover:text-blue-900">{p["Product Name"]}</h3>
                      </a>'''
    )
p.write_text(code)
PY

echo "✅ Production modules added"
npm run dev
