import Link from "next/link"
import { getAllSeries } from "@/lib/posts"
import { PageWrapper } from "@/components/page-wrapper"

export default async function SeriesPage() {
  const seriesList = await getAllSeries()

  return (
    <PageWrapper>
      <div>
      <h1 className="text-xl sm:text-2xl font-semibold mb-6">Series</h1>
      {seriesList.length === 0 ? (
        <p className="py-12 text-center text-neutral-500 dark:text-neutral-400 text-sm">No series yet.</p>
      ) : (
        <ul className="space-y-3">
          {seriesList.map((name) => (
            <li key={name}>
              <Link
                href={`/series/${encodeURIComponent(name)}`}
                className="text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-150"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      </div>
    </PageWrapper>
  )
}
