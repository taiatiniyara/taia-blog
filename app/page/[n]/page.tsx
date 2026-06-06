import Link from "next/link"
import { getPublishedPosts, totalPages } from "@/lib/posts"
import { PostList } from "@/components/post-list"
import { notFound } from "next/navigation"

export default async function PaginatedPage({
  params,
}: {
  params: Promise<{ n: string }>
}) {
  const { n } = await params
  const page = parseInt(n, 10)
  if (isNaN(page) || page < 1) notFound()

  const posts = await getPublishedPosts(page)
  const pages = await totalPages()

  if (posts.length === 0 && page > pages) notFound()

  return (
    <div>
      <PostList posts={posts} />
      {page < pages && (
        <div className="mt-8 text-center">
          <Link
            href={`/page/${page + 1}`}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Older Posts &rarr;
          </Link>
        </div>
      )}
      {page > 1 && (
        <div className="mt-4 text-center">
          <Link
            href={page === 2 ? "/" : `/page/${page - 1}`}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            &larr; Newer Posts
          </Link>
        </div>
      )}
    </div>
  )
}
