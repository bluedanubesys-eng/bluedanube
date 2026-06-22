#!/usr/bin/env bash
set -e

cat > src/components/layout/MobileBottomNav.tsx << 'TSX'
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
TSX

python3 << 'PY'
from pathlib import Path

# Add mobile bottom nav to public pages
pages = [
    "src/app/page.tsx",
    "src/app/shop/page.tsx",
    "src/app/cart/page.tsx",
    "src/app/checkout/page.tsx",
    "src/app/account/page.tsx",
    "src/app/partner/page.tsx",
    "src/app/partner/dashboard/page.tsx",
    "src/app/shop/[id]/page.tsx",
]

for file in pages:
    p = Path(file)
    if not p.exists():
        continue

    code = p.read_text()

    if 'MobileBottomNav' not in code:
        code = code.replace(
            'import ',
            'import MobileBottomNav from "@/components/layout/MobileBottomNav";\nimport ',
            1
        )

    if '<MobileBottomNav />' not in code:
        code = code.replace('</main>', '<MobileBottomNav />\n    </main>')

    # Add mobile safe bottom padding to main
    code = code.replace('min-h-screen bg-', 'min-h-screen pb-16 md:pb-0 bg-')

    p.write_text(code)

# Ensure MarketplaceHeader has no Admin public nav and no Myanmar text
p = Path("src/components/layout/MarketplaceHeader.tsx")
if p.exists():
    code = p.read_text()
    code = code.replace('<a href="/login">Admin</a>', '')
    code = code.replace('Admin', '')
    code = code.replace('Myanmar', 'International')
    code = code.replace('for International customers', 'for international customers')
    code = code.replace('for Myanmar customers', 'for international customers')
    p.write_text(code)

# Remove Myanmar text in public source
for p in Path("src").rglob("*"):
    if p.is_file() and p.suffix in [".tsx", ".ts", ".css"]:
        code = p.read_text(errors="ignore")
        if "Myanmar" in code:
            code = code.replace("Myanmar", "International")
            p.write_text(code)
PY

npm run build
./test-pages.sh
