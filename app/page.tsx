import Link from "next/link"
import { LuChevronRight } from "react-icons/lu"
import { getPublishedPosts, totalPages, loadExcerpts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { PageWrapper } from "@/components/page-wrapper"

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
  const excerpts = await loadExcerpts(posts)

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div />
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          <Link
            href={`/?sort=newest${page > 1 ? `&page=${page}` : ""}`}
              className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors duration-150 ${
                sort === "newest"
                  ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
          >
            Newest
          </Link>
          <Link
            href={`/?sort=oldest${page > 1 ? `&page=${page}` : ""}`}
              className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors duration-150 ${
                sort === "oldest"
                  ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
          >
            Oldest
          </Link>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              compact
              excerpt={excerpts.get(post.slug) ?? undefined}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-neutral-500 dark:text-neutral-400 text-sm">
          No posts yet.
        </div>
      )}

      {page < pages && (
        <div className="mt-12 text-center">
          <Link
            href={`/page/${page + 1}${sort === "oldest" ? "?sort=oldest" : ""}`}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1 transition-colors duration-150"
          >
            Older Posts <LuChevronRight size={14} />
          </Link>
        </div>
      )}
    </PageWrapper>
  )
}
