import MarketplaceHeader from "@/components/layout/MarketplaceHeader";

const categories = [
  ["Fashion", "Elegant European clothing"],
  ["Shoes", "Daily comfort and style"],
  ["Bags", "Premium accessories"],
  ["Lifestyle", "Selected everyday essentials"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <MarketplaceHeader />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#071b46] via-[#0b255c] to-[#122f72] p-10 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">
              Blue Danube Marketplace
            </p>
            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              European premium products for International customers.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Curated fashion, bags, shoes, accessories and lifestyle products with local order support.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/shop" className="rounded-full bg-amber-400 px-8 py-4 font-black text-[#071b46]">
                Shop Collection
              </a>
              <a href="/partner" className="rounded-full border border-white/30 px-8 py-4 font-black text-white">
                Become a Partner
              </a>
            </div>
          </div>

          <div className="grid gap-6">
            <a href="/shop" className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0b255c]">New Arrivals</p>
              <h2 className="mt-4 text-3xl font-black">Fresh European selections</h2>
              <p className="mt-3 text-slate-500">Discover curated products newly added to Blue Danube.</p>
            </a>

            <a href="/partner" className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0b255c]">Partner Program</p>
              <h2 className="mt-4 text-3xl font-black">Sell with Blue Danube</h2>
              <p className="mt-3 text-slate-500">Consignment and sales partner support with ERP reports.</p>
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {categories.map(([title, text]) => (
            <a
              key={title}
              href="/shop"
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 h-28 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200" />
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0b255c]">Why Blue Danube</p>
              <h2 className="mt-3 text-3xl font-black">A refined shopping experience</h2>
            </div>
            <a href="/shop" className="rounded-full bg-[#0b255c] px-6 py-3 font-black text-white">Browse Shop</a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              ["Authentic sourcing", "Selected European products"],
              ["Local payment", "KBZ Pay, Wave Pay and bank transfer"],
              ["Order tracking", "Status updates from order to delivery"],
              ["Partner support", "Commission and settlement reports"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
