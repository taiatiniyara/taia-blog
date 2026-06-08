import { PageWrapper } from "@/components/page-wrapper"

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="mt-2 h-3 w-1/3 bg-neutral-100 dark:bg-neutral-800 rounded" />
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <PageWrapper>
      <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded mb-6 animate-pulse" />
      <div className="grid gap-8 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </PageWrapper>
  )
}
