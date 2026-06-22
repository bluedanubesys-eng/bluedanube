export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">Blue Danube</h1>
          <nav className="flex gap-5 text-sm font-semibold">
            <a href="/shop">Shop</a>
            <a href="/cart">Cart</a>
            <a href="/partner">Partner</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="font-semibold uppercase tracking-[0.25em] text-blue-800">
          European Marketplace
        </p>

        <h2 className="mt-6 max-w-3xl text-5xl font-bold tracking-tight">
          Premium European products for Myanmar customers.
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Discover authentic European fashion, accessories, and lifestyle products from trusted brands.
        </p>

        <div className="mt-10 flex gap-4">
          <a href="/shop" className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white">
            Shop Now
          </a>
          <a href="/partner" className="rounded-xl border bg-white px-6 py-3 font-semibold">
            Become a Partner
          </a>
        </div>
      </section>
    </main>
  );
}
