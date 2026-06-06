export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[1fr_280px] lg:gap-10 animate-pulse">
      <div>
        <div className="h-8 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
        <div className="h-4 w-1/4 bg-neutral-100 dark:bg-neutral-800 rounded mb-8" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-5/6 bg-neutral-100 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-4/6 bg-neutral-100 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded" />
        </div>
      </div>
      <aside className="hidden lg:block mt-10 lg:mt-0">
        <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
              <div className="mt-1 h-3 w-1/3 bg-neutral-100 dark:bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
