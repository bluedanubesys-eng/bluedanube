"use client";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { fileToBase64 } from "@/lib/file";
import { cartTotal, clearCart, getCart } from "@/services/cart.service";
import type { CartItem } from "@/types/cart";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const steps = ["Customer", "Delivery", "Payment", "Review"];

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [township, setTownship] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("KBZ Pay");
  const [couponCode, setCouponCode] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setItems(getCart());
  }, []);

  const subtotal = cartTotal(items);

  async function sendOtp() {
    if (!email) return toast.error("Please enter Gmail first");

    const r = await erpPost({
      action: "sendCustomerCheckoutOtp",
      shopId: CONFIG.defaultShopId,
      email,
    });

    if (r.success) {
      setOtpSent(true);
      toast.success("OTP sent to Gmail");
    } else {
      toast.error(r.message || "OTP send failed");
    }
  }

  async function verifyOtp() {
    const r = await erpPost({
      action: "verifyCustomerCheckoutOtp",
      shopId: CONFIG.defaultShopId,
      email,
      code: otp,
    });

    if (r.success) {
      setOtpVerified(true);
      toast.success("Gmail verified");
    } else {
      toast.error(r.message || "Invalid OTP");
    }
  }

  async function submitOrder() {
    if (!otpVerified) return toast.error("Please verify Gmail first");
    if (!customerName || !phone || !email || !address) return toast.error("Please complete customer information");
    if (!paymentFile) return toast.error("Please upload payment screenshot");

    for (const item of items) {
      const stockQty = Number(item.product["Stock Qty"] || 0);
      if (item.qty > stockQty) {
        return toast.error(`${item.product["Product Name"]} only has ${stockQty} in stock`);
      }
    }

    setLoading(true);

    const paymentScreenshotBase64 = await fileToBase64(paymentFile);

    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await erpPost({
        action: "validateCoupon",
        shopId: CONFIG.defaultShopId,
        couponCode,
      });
      if (coupon.success) couponDiscount = Number(coupon.coupon["Discount Value"] || 0);
    }

    const grandTotal = Math.max(subtotal + deliveryFee - couponDiscount, 0);

    const res = await erpPost({
      action: "createOrderWithPaymentScreenshot",
      shopId: CONFIG.defaultShopId,
      customerName,
      phone,
      email,
      address,
      township,
      paymentMethod,
      deliveryFee,
      discount: couponDiscount,
      tax: 0,
      paymentScreenshotBase64,
      paymentScreenshotName: paymentFile.name,
      items: items.map((i) => ({
        productId: i.product["Product ID"],
        productName: i.product["Product Name"],
        brand: i.product.Brand,
        size: i.product.Size,
        color: i.product.Color,
        qty: i.qty,
        unitPrice: Number(i.product["Selling Price"] || 0),
      })),
      remarks: `Checkout total ${grandTotal} MMK`,
    });

    setLoading(false);

    if (res.success) {
      clearCart();
      setItems([]);
      toast.success(`Order submitted: ${res.orderId}`);
    } else {
      toast.error(res.message || "Order failed");
    }
  }

  return (
    <main className="min-h-screen pb-16 md:pb-0 bg-[#f5f6f8] text-slate-950">
      <header className="bg-[#071b46] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/shop" className="text-2xl font-black">Blue Danube Checkout</a>
          <nav className="flex gap-5 text-sm font-bold">
            <a href="/shop">Shop</a>
            <a href="/cart">Cart</a>
            <a href="/account">Orders</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0b255c]">Secure Checkout</p>
          <h1 className="mt-2 text-4xl font-black">Complete Your Order</h1>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {steps.map((s, i) => (
              <button key={s} type="button" onClick={() => setStep(i)} className={`rounded-2xl p-4 text-sm font-black ${i <= step ? "bg-[#0b255c] text-white" : "bg-slate-100 text-slate-500"}`}>
                {i + 1}. {s}
              </button>
            ))}
          </div>
        </div>

        {!items.length ? (
          <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">Your cart is empty</h2>
            <a href="/shop" className="mt-5 inline-block rounded-full bg-[#0b255c] px-6 py-3 font-black text-white">Continue Shopping</a>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
              {step === 0 && (
                <div className="grid gap-4">
                  <h2 className="text-2xl font-black">Customer Information</h2>
                  <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Customer Name" className="rounded-xl border px-4 py-3" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone" className="rounded-xl border px-4 py-3" />
                  <input value={email} onChange={(e) => { setEmail(e.target.value); setOtpVerified(false); }} type="email" required placeholder="Gmail" className="rounded-xl border px-4 py-3" />

                  <div className="flex gap-2">
                    <button type="button" onClick={sendOtp} className="rounded-xl bg-blue-950 px-4 py-3 font-black text-white">Send OTP</button>
                    {otpVerified && <span className="rounded-xl bg-green-100 px-4 py-3 font-black text-green-700">Verified</span>}
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="flex gap-2">
                      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="flex-1 rounded-xl border px-4 py-3" />
                      <button type="button" onClick={verifyOtp} className="rounded-xl bg-green-600 px-4 py-3 font-black text-white">Verify</button>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4">
                  <h2 className="text-2xl font-black">Delivery Details</h2>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Address" className="rounded-xl border px-4 py-3" />
                  <input value={township} onChange={(e) => setTownship(e.target.value)} placeholder="Township" className="rounded-xl border px-4 py-3" />
                  <input value={deliveryFee} onChange={(e) => setDeliveryFee(Number(e.target.value || 0))} type="number" placeholder="Delivery Fee" className="rounded-xl border px-4 py-3" />
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4">
                  <h2 className="text-2xl font-black">Payment</h2>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="rounded-xl border px-4 py-3">
                    <option>KBZ Pay</option>
                    <option>Wave Pay</option>
                    <option>AYA Pay</option>
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                  </select>
                  <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon Code optional" className="rounded-xl border px-4 py-3" />
                  <input onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} type="file" accept="image/*" required className="rounded-xl border px-4 py-3" />
                  {paymentFile && <p className="text-sm font-bold text-green-600">Payment screenshot selected: {paymentFile.name}</p>}
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-black">Review Your Order</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Please check all information carefully before submitting your order.
                  </p>

                  <div className="mt-6 grid gap-5">
                    <div className="rounded-2xl border bg-white p-5">
                      <h3 className="text-lg font-black text-blue-950">Customer Information</h3>
                      <div className="mt-3 grid gap-2 text-sm">
                        <p><b>Name:</b> {customerName || "-"}</p>
                        <p><b>Phone:</b> {phone || "-"}</p>
                        <p><b>Gmail:</b> {email || "-"}</p>
                        <p><b>Gmail Status:</b> {otpVerified ? "Verified ✅" : "Not Verified ❌"}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5">
                      <h3 className="text-lg font-black text-blue-950">Delivery Information</h3>
                      <div className="mt-3 grid gap-2 text-sm">
                        <p><b>Address:</b> {address || "-"}</p>
                        <p><b>Township:</b> {township || "-"}</p>
                        <p><b>Delivery Fee:</b> {deliveryFee.toLocaleString()} MMK</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5">
                      <h3 className="text-lg font-black text-blue-950">Payment Information</h3>
                      <div className="mt-3 grid gap-2 text-sm">
                        <p><b>Payment Method:</b> {paymentMethod || "-"}</p>
                        <p><b>Payment Screenshot:</b> {paymentFile?.name || "Not selected"}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5">
                      <h3 className="text-lg font-black text-blue-950">Order Items</h3>
                      <div className="mt-4 space-y-3">
                        {items.map((i) => (
                          <div key={i.product["Product ID"]} className="flex items-start justify-between border-b pb-3 text-sm last:border-b-0">
                            <div>
                              <p className="font-black">{i.product["Product Name"]}</p>
                              <p className="text-slate-500">
                                {i.product.Brand || "-"} • {i.product.Color || "-"} • {i.product.Size || "-"}
                              </p>
                              <p className="text-slate-500">
                                Qty: {i.qty} / Stock: {Number(i.product["Stock Qty"] || 0)}
                              </p>
                            </div>
                            <b>{(Number(i.product["Selling Price"] || 0) * i.qty).toLocaleString()} MMK</b>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-5">
                      <h3 className="text-lg font-black text-blue-950">Order Summary</h3>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <b>{subtotal.toLocaleString()} MMK</b>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Fee</span>
                          <b>{deliveryFee.toLocaleString()} MMK</b>
                        </div>
                        <div className="border-t pt-3 flex justify-between text-xl font-black">
                          <span>Grand Total</span>
                          <span>{(subtotal + deliveryFee).toLocaleString()} MMK</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button type="button" disabled={step <= 0} onClick={() => setStep(step - 1)} className="rounded-xl border px-6 py-3 font-black disabled:opacity-40">Back</button>
                {step < 3 ? (
                  <button type="button" onClick={() => setStep(step + 1)} className="rounded-xl bg-[#0b255c] px-6 py-3 font-black text-white">Continue</button>
                ) : (
                  <button type="button" disabled={loading || !otpVerified} onClick={submitOrder} className="rounded-xl bg-[#0b255c] px-6 py-3 font-black text-white disabled:opacity-60">
                    {loading ? "Submitting..." : "Submit Order"}
                  </button>
                )}
              </div>
            </div>

            <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-black">Order Summary</h2>
              <div className="mt-5 space-y-3">
                {items.map((i) => (
                  <div key={i.product["Product ID"]} className="flex justify-between text-sm">
                    <span>{i.product["Product Name"]} × {i.qty}</span>
                    <b>{(Number(i.product["Selling Price"] || 0) * i.qty).toLocaleString()} MMK</b>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-black">Subtotal</span>
                  <span className="font-black">{subtotal.toLocaleString()} MMK</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>

      <MobileBottomNav />
    </main>
  );
}
