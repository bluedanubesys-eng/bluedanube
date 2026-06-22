"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { useState } from "react";
export default function ReportsPage(){const[msg,setMsg]=useState("");async function run(action:string,reportType?:string){const r=await erpPost({action,shopId:CONFIG.defaultShopId,reportType});if(r.url){setMsg(r.url);window.open(r.url,"_blank")}else setMsg(JSON.stringify(r.report||r,null,2))}return <AdminLayout><h1 className="text-3xl font-bold">Reports</h1><div className="mt-8 grid gap-4 md:grid-cols-3">{[["Profit & Loss","getProfitLossReport"],["Inventory Valuation","getInventoryValuationReport"],["Partner Performance","getPartnerPerformanceReport"],["Export Orders CSV","exportReportCsv","orders"],["Export Products CSV","exportReportCsv","products"],["Backup","exportBackup"]].map((x:any)=><button key={x[0]} onClick={()=>run(x[1],x[2])} className="rounded-2xl border bg-white p-6 text-left font-bold shadow-sm">{x[0]}</button>)}</div>{msg&&<pre className="mt-8 overflow-auto rounded-2xl bg-slate-950 p-6 text-sm text-white">{msg}</pre>}</AdminLayout>}
