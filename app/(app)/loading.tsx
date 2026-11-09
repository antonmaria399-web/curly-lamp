export default function Loading() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="skeleton h-9 w-56" />
      <div className="skeleton h-4 w-80" />
      <div className="skeleton mt-6 h-40 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="skeleton h-28" />
        <div className="skeleton h-28" />
      </div>
    </div>
  );
}
