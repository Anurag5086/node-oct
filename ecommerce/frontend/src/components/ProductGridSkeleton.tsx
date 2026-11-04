export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="aspect-[4/5] bg-stone-200" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-16 rounded bg-stone-200" />
            <div className="h-4 w-full rounded bg-stone-200" />
            <div className="h-4 w-2/3 rounded bg-stone-200" />
            <div className="h-8 w-24 rounded bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  )
}
