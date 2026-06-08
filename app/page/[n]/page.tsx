import Link from "next/link"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { getPublishedPosts, totalPages, loadExcerpts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { PageWrapper } from "@/components/page-wrapper"
import { notFound } from "next/navigation"

export default async function PaginatedPage({
  params,
  searchParams,
}: {
  params: Promise<{ n: string }>
  searchParams: Promise<{ sort?: string }>
}) {
  const { n } = await params
  const sp = await searchParams
  const page = parseInt(n, 10)
  if (isNaN(page) || page < 1) notFound()

  const sort = sp.sort === "oldest" ? "oldest" : "newest"
  const posts = await getPublishedPosts(page, sort)
  const pages = await totalPages()
  const cardData = await loadExcerpts(posts)

  if (posts.length === 0 && page > pages) notFound()

  return (
    <PageWrapper className="max-w-4xl">
      <h2 className="text-sm font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-6">
        Page {page}
      </h2>
      <div className="grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            compact
            excerpt={cardData.get(post.slug)?.excerpt ?? undefined}
            firstImage={cardData.get(post.slug)?.firstImage}
          />
        ))}
      </div>
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
      {page > 1 && (
        <div className="mt-4 text-center">
          <Link
            href={page === 2 ? `/${sort === "oldest" ? "?sort=oldest" : ""}` : `/page/${page - 1}${sort === "oldest" ? "?sort=oldest" : ""}`}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1 transition-colors duration-150"
          >
            <LuChevronLeft size={14} /> Newer Posts
          </Link>
        </div>
      )}
    </PageWrapper>
  )
}
