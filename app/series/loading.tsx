import { PageWrapper } from "@/components/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="animate-pulse">
        <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-5 w-48 bg-neutral-100 dark:bg-neutral-800 rounded" />
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
