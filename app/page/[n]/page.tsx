import Link from "next/link"
import { getPublishedPosts, totalPages } from "@/lib/posts"
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

  if (posts.length === 0 && page > pages) notFound()

  return (
    <PageWrapper>
      <div>
      <h2 className="text-sm font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-6">
        Page {page}
      </h2>
      <div className="grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} compact />
        ))}
      </div>
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
      {page > 1 && (
        <div className="mt-4 text-center">
          <Link
            href={page === 2 ? `/${sort === "oldest" ? "?sort=oldest" : ""}` : `/page/${page - 1}${sort === "oldest" ? "?sort=oldest" : ""}`}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            &larr; Newer Posts
          </Link>
        </div>
      )}
      </div>
    </PageWrapper>
  )
}
