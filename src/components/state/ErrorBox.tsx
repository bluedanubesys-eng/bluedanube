export default function ErrorBox({ message }: { message: string }) {
  return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 font-bold text-red-700">{message}</div>;
}
