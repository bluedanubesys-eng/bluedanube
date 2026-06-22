"use client";
import { erpGet } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useEffect, useState } from "react";

export default function RecentActivityWidget() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    erpGet("activityLogs", { shopId: CONFIG.defaultShopId }).then((res) => {
      setRows((res.activityLogs || []).slice(-5).reverse());
    });
  }, []);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Recent Activity</h2>
      <div className="mt-5 space-y-3">
        {!rows.length && <p className="text-sm text-slate-500">No recent activity.</p>}
        {rows.map((r, i) => (
          <div key={i} className="rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="font-black">{r.Action || r.action || "Activity"}</p>
            <p className="text-slate-500">{r.Detail || r.detail || ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
