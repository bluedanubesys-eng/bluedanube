"use client";

import Image from "next/image";
import { erpPost } from "@/lib/api";
import { successPopup, errorPopup } from "@/lib/popup";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    if (!email) return errorPopup("Please enter admin Gmail");
    setLoading(true);

    const r = await erpPost({
      action: "sendGmailVerificationCode",
      email,
    });

    setLoading(false);

    if (r.success) {
      setSent(true);
      successPopup("OTP sent to Gmail");
    } else {
      errorPopup(r.message || "OTP send failed");
    }
  }

  async function verifyOtp() {
    if (!email || !code) return errorPopup("Email and OTP required");
    setLoading(true);

    const r = await erpPost({
      action: "verifyGmailCode",
      email,
      code,
    });

    setLoading(false);

    if (r.success) {
      document.cookie = `bd_token=${r.token || "verified"}; path=/; max-age=86400`;
      localStorage.setItem("bd_admin_email", email);
      successPopup("Login verified");
      window.location.href = "/admin/dashboard";
    } else {
      errorPopup(r.message || "Invalid OTP");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-6">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Blue Danube" width={96} height={96} className="h-24 w-24 object-contain" />
          <h1 className="mt-4 text-3xl font-black text-blue-950">Blue Danube</h1>
          <p className="mt-2 text-sm text-slate-500">Admin Gmail Verification Login</p>
        </div>

        <div className="mt-8 grid gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Admin Gmail"
            className="rounded-xl border px-4 py-3"
          />

          {sent && (
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="rounded-xl border px-4 py-3"
            />
          )}

          {!sent ? (
            <button disabled={loading} onClick={sendOtp} className="rounded-xl bg-blue-950 px-6 py-3 font-black text-white disabled:opacity-60">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <button disabled={loading} onClick={verifyOtp} className="rounded-xl bg-blue-950 px-6 py-3 font-black text-white disabled:opacity-60">
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
