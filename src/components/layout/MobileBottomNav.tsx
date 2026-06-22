export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4 text-center text-xs font-black text-slate-700">
        <a href="/" className="px-2 py-3">Home</a>
        <a href="/shop" className="px-2 py-3">Shop</a>
        <a href="/cart" className="px-2 py-3">Cart</a>
        <a href="/account" className="px-2 py-3">Orders</a>
      </div>
    </nav>
  );
}
