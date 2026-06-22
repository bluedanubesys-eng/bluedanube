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
    erpGet(actionMap["notifications"] || "notifications", { shopId: CONFIG.defaultShopId }).then((res) => {
      const firstArray = Object.values(res).find((v) => Array.isArray(v)) as any[];
      setRows(firstArray || []);
    });
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black capitalize">notifications</h1>
      <div className="mt-8 overflow-auto rounded-3xl border bg-white p-6 shadow-sm">
        <pre className="text-sm">{JSON.stringify(rows, null, 2)}</pre>
      </div>
    </AdminLayout>
  );
}
