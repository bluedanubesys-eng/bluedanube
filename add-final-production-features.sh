#!/usr/bin/env bash
set -e

mkdir -p src/app/orders/[id] src/components/state src/components/tables

cat > src/components/state/LoadingSkeleton.tsx << 'TSX'
export default function LoadingSkeleton() {
  return <div className="animate-pulse rounded-3xl bg-white p-6 shadow-sm"><div className="h-6 w-1/3 rounded bg-slate-200" /><div className="mt-4 h-24 rounded bg-slate-100" /></div>;
}
TSX

cat > src/components/state/ErrorBox.tsx << 'TSX'
export default function ErrorBox({ message }: { message: string }) {
  return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 font-bold text-red-700">{message}</div>;
}
TSX

cat > src/app/orders/[id]/page.tsx << 'TSX'
"use client";

import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = String(params.id || "");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    erpGet("orders", { shopId: CONFIG.defaultShopId }).then((res) => {
      const found = (res.orders || []).find((o: any) => o["Order ID"] === orderId);
      setOrder(found || null);
    });
  }, [orderId]);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-4 text-2xl font-black">Blue Danube Order Status</div>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-8">
        {!order ? <div className="rounded-3xl bg-white p-8 font-bold">Loading order...</div> : (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-black">{order["Order ID"]}</h1>
            <p className="mt-4 text-lg font-bold">Order Status: {order["Order Status"]}</p>
            <p className="mt-2 text-lg font-bold">Payment Status: {order["Payment Status"]}</p>
            <p className="mt-2 text-lg font-bold">Total: {order["Grand Total"]} MMK</p>
            <p className="mt-4 text-slate-600">{order.Address}</p>
          </div>
        )}
      </section>
    </main>
  );
}
TSX

cat > src/components/tables/DataTable.tsx << 'TSX'
"use client";

import { useMemo, useState } from "react";

export default function DataTable({ rows }: { rows: any[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const headers = filtered[0] ? Object.keys(filtered[0]).slice(0, 8) : [];

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="mb-4 w-full rounded-xl border px-4 py-3" />
      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead><tr>{headers.map(h => <th key={h} className="p-3 font-black">{h}</th>)}</tr></thead>
          <tbody>{filtered.map((r,i)=><tr key={i} className="border-t">{headers.map(h=><td key={h} className="p-3">{String(r[h] ?? "")}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
TSX

python3 << 'PY'
from pathlib import Path
p = Path("backend/Code.gs")
code = p.read_text()

# Replace old branding safely
code = code.replace("Piano For ALL", "Blue Danube")
code = code.replace("pianoforallmusiceducation@gmail.com", "bluedanube.sys@gmail.com")
code = code.replace("https://piano-for-all.onrender.com", "http://localhost:3000")
code = code.replace("PFA_", "BD_")
code = code.replace("PFA-", "BD-")

# Add routes
if 'if (action === "validateCoupon")' not in code:
    code = code.replace(
        'if (action === "createCoupon") return createCoupon(data);',
        '''if (action === "createCoupon") return createCoupon(data);
    if (action === "validateCoupon") return validateCoupon(data);
    if (action === "generateAllOrderDocuments") return generateAllOrderDocuments(data);
    if (action === "roleCheck") return roleCheck(data);'''
    )

extra = r'''

/* ======================================================
   FINAL PRODUCTION HELPERS
====================================================== */

function validateCoupon(data) {
  const code = String(data.couponCode || "").trim();
  const rows = getSheetDataArray(SHEETS.coupons || "Coupons");
  const found = rows.find(r => String(r["Coupon Code"]).trim() === code && String(r.Status).toLowerCase() === "active");
  if (!found) return json({ success: false, message: "Invalid coupon" });
  return json({ success: true, coupon: found });
}

function generateAllOrderDocuments(data) {
  const invoice = generateInvoicePdf(data);
  const receipt = generateReceiptPdf(data);
  const delivery = generateDeliverySlipPdf(data);
  return json({ success: true, message: "Documents generated. Check Documents sheet." });
}

function roleCheck(data) {
  const allowed = hasPermission(data.role || "Staff", data.permission || "");
  return json({ success: true, allowed });
}
'''
if 'function validateCoupon(data)' not in code:
    code += extra

p.write_text(code)
PY

python3 << 'PY'
from pathlib import Path
p = Path("src/components/layout/AdminLayout.tsx")
code = p.read_text()
if 'menuOpen' not in code:
    code = code.replace('export default function AdminLayout({ children }: { children: React.ReactNode }) {', '''import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);''')
    code = code.replace('<main className="min-h-screen bg-slate-50">', '<main className="min-h-screen bg-slate-50"><button onClick={()=>setMenuOpen(!menuOpen)} className="fixed left-4 top-4 z-[60] rounded-xl bg-blue-950 px-4 py-2 font-black text-white lg:hidden">Menu</button>')
    code = code.replace('fixed left-0 top-0 h-screen w-64', 'fixed left-0 top-0 z-50 h-screen w-64')
    code = code.replace('<aside className="fixed left-0 top-0 z-50 h-screen w-64', '<aside className={`${menuOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-50 h-screen w-64 transition lg:translate-x-0')
    code = code.replace('<section className="ml-64 p-6">', '<section className="p-6 lg:ml-64">')
p.write_text(code)
PY

python3 << 'PY'
from pathlib import Path
p = Path("src/app/checkout/page.tsx")
code = p.read_text()
if 'couponCode' not in code:
    code = code.replace('<input name="paymentScreenshot" type="file"', '<input name="couponCode" placeholder="Coupon Code optional" className="rounded-xl border px-4 py-3" />\n              <input name="paymentScreenshot" type="file"')
    code = code.replace('const deliveryFee = Number(f.get("deliveryFee") || 0);', '''const deliveryFee = Number(f.get("deliveryFee") || 0);
    const couponCode = String(f.get("couponCode") || "");
    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await erpPost({ action: "validateCoupon", shopId: CONFIG.defaultShopId, couponCode });
      if (coupon.success) couponDiscount = Number(coupon.coupon["Discount Value"] || 0);
    }''')
    code = code.replace('const grandTotal = subtotal + deliveryFee;', 'const grandTotal = Math.max(subtotal + deliveryFee - couponDiscount, 0);')
p.write_text(code)
PY

python3 << 'PY'
from pathlib import Path
p = Path("src/app/shop/[id]/page.tsx")
code = p.read_text()
if 'createWishlist' not in code:
    code = code.replace('import { addToCart } from "@/services/cart.service";', 'import { addToCart } from "@/services/cart.service";\nimport { erpPost } from "@/lib/api";\nimport { CONFIG } from "@/lib/config";')
    code = code.replace('</button>\n        </div>', '''</button>
          <button onClick={() => erpPost({ action: "createWishlist", shopId: CONFIG.defaultShopId, productId: product["Product ID"], productName: product["Product Name"], email: prompt("Your Gmail") || "" })} className="mt-3 w-full rounded-full border px-6 py-4 font-black">
            Add to Wishlist
          </button>
          <form onSubmit={async e => { e.preventDefault(); const f = new FormData(e.currentTarget); await erpPost({ action: "createReview", shopId: CONFIG.defaultShopId, productId: product["Product ID"], customerName: f.get("name"), rating: f.get("rating"), comment: f.get("comment") }); alert("Review submitted"); }} className="mt-8 grid gap-3">
            <h2 className="text-xl font-black">Write a Review</h2>
            <input name="name" placeholder="Your name" className="rounded-xl border px-4 py-3" />
            <input name="rating" type="number" min="1" max="5" defaultValue="5" className="rounded-xl border px-4 py-3" />
            <textarea name="comment" placeholder="Comment" className="rounded-xl border px-4 py-3" />
            <button className="rounded-xl bg-blue-950 px-4 py-3 font-black text-white">Submit Review</button>
          </form>
        </div>''')
p.write_text(code)
PY

python3 << 'PY'
from pathlib import Path
p = Path("src/app/admin/orders/page.tsx")
code = p.read_text()
if 'generateAllOrderDocuments' not in code:
    code = code.replace('</form>', '''<div className="mt-6 rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-black">Documents</h2>
        <form onSubmit={async e => { e.preventDefault(); const f = new FormData(e.currentTarget); const r = await erpPost({ action: "generateAllOrderDocuments", orderId: f.get("orderId"), shopId: CONFIG.defaultShopId }); alert(r.message || "Done"); }} className="mt-4 flex gap-3">
          <input name="orderId" placeholder="Order ID" className="flex-1 rounded-xl border px-4 py-3" />
          <button className="rounded-xl bg-blue-950 px-6 py-3 font-black text-white">Generate PDFs</button>
        </form>
      </div>
      </form>''')
p.write_text(code)
PY

echo "✅ Final production features patched"
npm run dev
