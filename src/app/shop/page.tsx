const products = [1, 2, 3, 4];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">Blue Danube Shop</h1>
        <p className="mt-2 text-slate-600">European style marketplace product listing.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {products.map((item) => (
            <div key={item} className="rounded-2xl border p-4 shadow-sm">
              <div className="aspect-square rounded-xl bg-slate-100" />
              <h2 className="mt-4 font-bold">European Product {item}</h2>
              <p className="text-sm text-slate-500">Brand / Size / Color</p>
              <p className="mt-2 font-bold">0 MMK</p>
              <button className="mt-4 w-full rounded-xl bg-blue-950 px-4 py-2 font-semibold text-white">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
