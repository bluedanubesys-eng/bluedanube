"use client";
export default function NotificationBell() {
  return (
    <button className="relative rounded-full border bg-white px-4 py-2 text-sm font-black shadow-sm">
      Notifications
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500" />
    </button>
  );
}
