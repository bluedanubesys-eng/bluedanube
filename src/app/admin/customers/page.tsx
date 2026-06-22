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
