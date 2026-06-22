export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <header className="sticky top-0 z-50 bg-[#0f1f4a] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <a href="/" className="text-2xl font-black tracking-tight">Blue Danube</a>
          <div className="hidden flex-1 md:block">
            <input className="w-full rounded-full bg-white px-6 py-3 text-sm text-slate-900 outline-none" placeholder="Search European products, brands, categories..." />
          </div>
          <nav className="flex gap-5 text-sm font-bold">
            <a href="/shop">Shop</a>
            <a href="/cart">Cart</a>
            <a href="/partner">Partner</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f1f4a] via-[#17306f] to-[#07122d] p-10 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">European Marketplace</p>
            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              Premium European products, delivered with local support.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Curated fashion, accessories, shoes, bags and lifestyle items for Myanmar customers.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/shop" className="rounded-full bg-white px-8 py-4 font-black text-[#0f1f4a] shadow-lg">Shop Now</a>
              <a href="/partner" className="rounded-full border border-white/30 px-8 py-4 font-black text-white">Become a Partner</a>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-900">Today Highlight</p>
              <h2 className="mt-4 text-3xl font-black">European Essentials</h2>
              <p className="mt-3 text-slate-500">New arrivals and selected quality products.</p>
              <a href="/shop" className="mt-6 inline-block font-black text-blue-950">Explore collection →</a>
            </div>

            <div className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-900">Partner Program</p>
              <h2 className="mt-4 text-3xl font-black">Sell with Blue Danube</h2>
              <p className="mt-3 text-slate-500">Partner and consignment product support.</p>
              <a href="/partner" className="mt-6 inline-block font-black text-blue-950">Apply now →</a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["Authentic Sourcing", "Selected European products"],
            ["Local Payment", "KBZ Pay, Wave Pay, bank transfer"],
            ["Order Tracking", "Confirmation and delivery updates"],
            ["Partner Sales", "Commission and settlement support"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
