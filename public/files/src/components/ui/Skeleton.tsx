/** Warm-cream shimmer block. Compose the variants below rather than styling ad hoc. */
function Block({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-cream-parchment ${className}`} />;
}

/** Product/merchandising tile skeleton — image + 2 text lines + price line. */
export function ProductTileSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Block className="aspect-square w-full rounded" />
      <Block className="h-3 w-1/3" />
      <Block className="h-4 w-3/4" />
      <Block className="h-4 w-1/4" />
    </div>
  );
}

/** Admin table row skeleton — thumbnail + a few column bars. */
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-card-border py-3">
      <Block className="h-10 w-10 shrink-0" />
      <Block className="h-3 w-1/4" />
      <Block className="h-3 w-1/6" />
      <Block className="h-3 w-1/6" />
      <Block className="h-3 w-1/6" />
    </div>
  );
}

/** Detail viewport skeleton (product detail / order detail) — gallery + side panel. */
export function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Block className="aspect-[4/3] w-full rounded-lg" />
      <div className="flex flex-col gap-3">
        <Block className="h-3 w-1/4" />
        <Block className="h-8 w-3/4" />
        <Block className="h-4 w-1/2" />
        <Block className="h-24 w-full" />
        <Block className="h-11 w-full" />
      </div>
    </div>
  );
}
