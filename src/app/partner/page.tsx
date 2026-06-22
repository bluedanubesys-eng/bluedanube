import MobileBottomNav from "@/components/layout/MobileBottomNav";
export default function PartnerPage() {
  return (
    <main className="min-h-screen pb-16 md:pb-0 bg-[#f5f6f8] text-slate-950">
      <header className="bg-[#071b46] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-black">Blue Danube</a>
          <nav className="flex gap-5 text-sm font-bold">
            <a href="/shop">Shop</a>
            <a href="/account">Orders</a>
            <a href="/partner/dashboard">Partner Login</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#071b46] via-[#0b255c] to-[#122f72] p-10 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">
              Partner Program
            </p>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-tight">
              Sell premium products with Blue Danube.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Join as a sales partner or consignment partner and manage commissions, settlements, and product performance through our ERP partner system.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#apply" className="rounded-full bg-amber-400 px-8 py-4 font-black text-[#071b46]">
                Apply as Partner
              </a>
              <a href="/partner/dashboard" className="rounded-full border border-white/30 px-8 py-4 font-black text-white">
                Open Dashboard
              </a>
            </div>
          </div>

          <div className="grid gap-5">
            {[
              ["Sales Partner", "Earn commission by bringing orders and customers."],
              ["Consignment Partner", "Place your products with Blue Danube and track settlements."],
              ["Transparent Reports", "View sales, commissions, payouts, and balances."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-2xl font-black">{title}</h2>
                <p className="mt-3 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {[
            ["Commission Tracking", "Track commission per order."],
            ["Monthly Settlement", "Review payout balances clearly."],
            ["Product Performance", "See product and order activity."],
            ["ERP Transparency", "Structured records for every transaction."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>

        <div id="apply" className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0b255c]">
              How it works
            </p>
            <div className="mt-6 space-y-5">
              {[
                ["1", "Apply as a partner"],
                ["2", "Get partner ID from Blue Danube"],
                ["3", "Submit or promote products"],
                ["4", "Track commissions and settlements"],
              ].map(([n, text]) => (
                <div key={n} className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b255c] font-black text-white">
                    {n}
                  </div>
                  <p className="pt-2 font-bold">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <form className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-3xl font-black">Partner Application</h2>
            <p className="mt-2 text-slate-500">
              Submit your details. Our team will contact you after review.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input placeholder="Full Name" className="rounded-xl border px-4 py-3" />
              <input placeholder="Phone" className="rounded-xl border px-4 py-3" />
              <input placeholder="Email" className="rounded-xl border px-4 py-3" />
              <select className="rounded-xl border px-4 py-3">
                <option>Sales Partner</option>
                <option>Consignment Partner</option>
              </select>
            </div>

            <textarea
              placeholder="Tell us about your products, customers, or sales network"
              className="mt-4 min-h-32 w-full rounded-xl border px-4 py-3"
            />

            <button
              type="button"
              className="mt-5 rounded-full bg-[#0b255c] px-8 py-4 font-black text-white"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>
    <MobileBottomNav />
    </main>
  );
}
