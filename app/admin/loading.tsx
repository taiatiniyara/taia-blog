export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800"
        >
          <div className="space-y-1">
            <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-24 bg-neutral-100 dark:bg-neutral-800 rounded" />
          </div>
          <div className="h-5 w-16 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
        </div>
      ))}
    </div>
  )
}
