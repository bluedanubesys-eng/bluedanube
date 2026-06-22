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
