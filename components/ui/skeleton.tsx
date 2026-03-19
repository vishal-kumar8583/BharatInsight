export function SkeletonGrid() {
  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="shimmer h-4 w-48 rounded" />
        <div className="shimmer h-5 w-20 rounded-full" />
      </div>

      {/* Column headers */}
      <div className="flex border-b border-border bg-background/50 px-3 py-2.5 gap-4">
        {[60, 160, 140, 80, 200, 120, 100, 100, 80].map((w, i) => (
          <div key={i} className="shimmer h-3 rounded" style={{ width: w * 0.6 }} />
        ))}
      </div>

      {/* Row skeletons */}
      <div className="flex-1 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-3 border-b border-border/50"
            style={{ height: 44 }}
          >
            <div className="shimmer h-3 w-8 rounded" />
            <div className="shimmer h-3 rounded" style={{ width: 100 + (i % 3) * 20 }} />
            <div className="shimmer h-3 rounded" style={{ width: 80 + (i % 2) * 15 }} />
            <div className="shimmer h-3 w-12 rounded" />
            <div className="shimmer h-3 rounded" style={{ width: 140 + (i % 4) * 10 }} />
            <div className="shimmer h-3 w-16 rounded" />
            <div className="shimmer h-3 w-12 rounded" />
            <div className="shimmer h-3 w-14 rounded" />
            <div className="shimmer h-3 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      <div className="shimmer h-4 w-3/4 rounded" />
      <div className="shimmer h-3 w-full rounded" />
      <div className="shimmer h-3 w-5/6 rounded" />
      <div className="shimmer h-8 w-24 rounded-lg mt-4" />
    </div>
  );
}
