import Link from "next/link"
import { getSeriesPosts, getAllSeries } from "@/lib/posts"
import { formatDate } from "@/lib/format-date"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  return {
    title: decoded,
    description: `Posts in the ${decoded} series.`,
  }
}

export default async function SeriesDetailPage({ params }: Props) {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  const posts = await getSeriesPosts(decoded)

  if (posts.length === 0) notFound()

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">{decoded}</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {posts.length} post{posts.length !== 1 ? "s" : ""} in this series
      </p>
      <ol className="space-y-4">
        {posts.map((post, i) => (
          <li key={post.slug} className="flex gap-3 items-baseline">
            <span className="text-sm text-neutral-400 dark:text-neutral-500 font-mono tabular-nums w-6 shrink-0">
              {i + 1}.
            </span>
            <div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400"
              >
                {post.title}
              </Link>
              <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export async function generateStaticParams() {
  const series = await getAllSeries()
  return series.map((name) => ({ name }))
}
