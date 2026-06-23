"use client";
import { useState } from "react";
import { logout } from "@/services/auth.service";
import NotificationBell from "@/components/widgets/NotificationBell";

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
  ["Documents", "/admin/documents"],
  ["Notifications", "/admin/notifications"],
  ["Activity Logs", "/admin/activity-logs"],
  ["Audit Logs", "/admin/audit-logs"],
  ["Analytics", "/admin/analytics"],
  ["Coupons", "/admin/coupons"],
  ["Reviews", "/admin/reviews"],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed left-4 top-4 z-[60] rounded-xl bg-blue-950 px-4 py-2 font-black text-white lg:hidden"
      >
        Menu
      </button>

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 overflow-y-auto border-r bg-white p-5 transition lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h1 className="text-xl font-bold text-blue-950">Blue Danube</h1>
        <p className="text-xs text-slate-500">Premium Collection</p>

        <nav className="mt-8 space-y-1">
          {menu.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-blue-950 hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-8 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
        >
          Logout
        </button>
      </aside>

      <section className="p-6 pt-16 lg:ml-64 lg:pt-6"><div className="mb-6 flex items-center justify-end gap-3"><NotificationBell /><button onClick={logout} className="rounded-full border bg-white px-4 py-2 text-sm font-black shadow-sm">Admin</button></div>{children}</section>
    </main>
  );
}
