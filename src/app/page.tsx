import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MarketplaceHeader from "@/components/layout/MarketplaceHeader";

const categories = [
  ["Fashion", "Elegant clothing and daily essentials"],
  ["Shoes", "Comfortable everyday style"],
  ["Bags", "Selected premium accessories"],
  ["Lifestyle", "Thoughtfully chosen products"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] pb-16 text-slate-950 md:pb-0">
      <MarketplaceHeader />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-xl">
          <img
            src="/hero-bluedanube.png"
            alt="Blue Danube Premium Collection"
            className="block h-auto w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {categories.map(([title, text]) => (
            <a
              key={title}
              href={`/shop?category=${encodeURIComponent(title)}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-xl font-black text-[#0b255c]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </a>
          ))}
        </div>
      </section>

      <MobileBottomNav />
    </main>
  );
}
