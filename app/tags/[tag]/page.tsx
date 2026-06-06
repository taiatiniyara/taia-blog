import Link from "next/link"
import { LuChevronRight } from "react-icons/lu"
import { PostList } from "@/components/post-list"
import { PageWrapper } from "@/components/page-wrapper"

export const dynamic = "force-dynamic"

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { tag } = await params
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1)
  const { getPostsByTag } = await import("@/lib/posts")
  const posts = await getPostsByTag(tag, page)
  const hasMore = posts.length === 10

  const decodedTag = decodeURIComponent(tag)

  return (
    <PageWrapper>
      <div>
        <h1 className="text-xl font-semibold mb-6">
          Posts tagged &ldquo;{decodedTag}&rdquo;
        </h1>
        <PostList posts={posts} />
        {hasMore && (
          <div className="mt-8 text-center">
            <Link
              href={`/tags/${encodeURIComponent(tag)}?page=${page + 1}`}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1"
            >
              Older Posts <LuChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
