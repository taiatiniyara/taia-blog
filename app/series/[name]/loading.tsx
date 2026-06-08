import { PageWrapper } from "@/components/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="animate-pulse">
        <div className="h-7 w-48 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
        <div className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800 rounded mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-5 w-6 bg-neutral-100 dark:bg-neutral-800 rounded shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="h-4 w-24 bg-neutral-100 dark:bg-neutral-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
