import Link from "next/link"
import { getPublishedPosts, totalPages } from "@/lib/posts"
import { PostList } from "@/components/post-list"

export const dynamic = "force-dynamic"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1)
  const posts = await getPublishedPosts(page)
  const pages = await totalPages()

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
    </div>
  )
}
