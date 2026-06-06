import Link from "next/link"
import { getPublishedPosts, totalPages } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { PostHero } from "@/components/post-hero"

export const dynamic = "force-dynamic"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1)
  const sort = params.sort === "oldest" ? "oldest" : "newest"
  const posts = await getPublishedPosts(page, sort)
  const pages = await totalPages()

  const isFirst = page === 1
  const featured = isFirst && sort === "newest" ? posts[0] : null
  const grid = isFirst && featured ? posts.slice(1) : posts

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div />
        <div className="flex items-center gap-1 text-sm">
          <Link
            href={`/?sort=newest${page > 1 ? `&page=${page}` : ""}`}
            className={`px-3 py-1 rounded-md ${
              sort === "newest"
                ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Newest
          </Link>
          <Link
            href={`/?sort=oldest${page > 1 ? `&page=${page}` : ""}`}
            className={`px-3 py-1 rounded-md ${
              sort === "oldest"
                ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Oldest
          </Link>
        </div>
      </div>

      {featured && <PostHero post={featured} />}

      {grid.length > 0 ? (
        <div className={featured ? "mt-12" : ""}>
          {featured && (
            <h2 className="text-sm font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-6">
              Recent Posts
            </h2>
          )}
          <div className="grid gap-8 sm:grid-cols-2">
            {grid.map((post) => (
              <PostCard key={post.id} post={post} compact />
            ))}
          </div>
        </div>
      ) : (
        !featured && (
          <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
            No posts yet.
          </div>
        )
      )}

      {page < pages && (
        <div className="mt-12 text-center">
          <Link
            href={`/page/${page + 1}${sort === "oldest" ? "?sort=oldest" : ""}`}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Older Posts &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}
