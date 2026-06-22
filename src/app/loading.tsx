export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-blue-950"></div>
        <h2 className="text-xl font-black text-blue-950">
          Loading...
        </h2>
        <p className="text-sm text-slate-500">
          Please wait
        </p>
      </div>
    </div>
  );
}
