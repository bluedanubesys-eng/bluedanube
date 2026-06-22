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
