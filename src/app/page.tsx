import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Premium CollectionHeader from "@/components/layout/Premium CollectionHeader";

const categories = [
  ["Fashion", "Elegant European clothing"],
  ["Shoes", "Daily comfort and style"],
  ["Bags", "Premium accessories"],
  ["Lifestyle", "Selected everyday essentials"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen pb-16 md:pb-0 bg-[#f5f6f8] text-slate-950">
      <Premium CollectionHeader />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-xl">
        <img
          src="/images/hero-bluedanube.png"
          alt="Blue Danube Premium Collection"
          className="h-auto w-full object-cover"
        />
      </div>
    </section>
    <MobileBottomNav />
    </main>
  );
}
