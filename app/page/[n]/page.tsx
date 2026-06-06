import Link from "next/link"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { getPublishedPosts, totalPages } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { PageWrapper } from "@/components/page-wrapper"
import { loadContent } from "@/lib/content-store"
import { notFound } from "next/navigation"

async function loadExcerpts(
  posts: Awaited<ReturnType<typeof getPublishedPosts>>,
): Promise<Map<string, string | null>> {
  const excerpts = new Map<string, string | null>()
  const results = await Promise.allSettled(
    posts.map(async (post) => {
      const content = await loadContent(post.slug)
      if (!content) return { slug: post.slug, excerpt: null }
      return { slug: post.slug, excerpt: extractText(content) }
    }),
  )
  for (const result of results) {
    if (result.status === "fulfilled") {
      excerpts.set(result.value.slug, result.value.excerpt)
    }
  }
  return excerpts
}

function extractText(content: Record<string, unknown>): string {
  const walk = (node: unknown): string => {
    if (typeof node === "string") return node
    if (Array.isArray(node)) return node.map(walk).join(" ")
    if (node && typeof node === "object" && "text" in node)
      return String((node as Record<string, unknown>).text)
    if (node && typeof node === "object" && "content" in node)
      return walk((node as Record<string, unknown>).content)
    return ""
  }
  const text = walk(content)
  return text.replace(/\s+/g, " ").trim().slice(0, 200).replace(/\s+\S*$/, "") || ""
}

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
  const excerpts = await loadExcerpts(posts)

  if (posts.length === 0 && page > pages) notFound()

  return (
    <PageWrapper>
      <h2 className="text-sm font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-6">
        Page {page}
      </h2>
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
      {page < pages && (
        <div className="mt-12 text-center">
          <Link
            href={`/page/${page + 1}${sort === "oldest" ? "?sort=oldest" : ""}`}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1"
          >
            Older Posts <LuChevronRight size={14} />
          </Link>
        </div>
      )}
      {page > 1 && (
        <div className="mt-4 text-center">
          <Link
            href={page === 2 ? `/${sort === "oldest" ? "?sort=oldest" : ""}` : `/page/${page - 1}${sort === "oldest" ? "?sort=oldest" : ""}`}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1"
          >
            <LuChevronLeft size={14} /> Newer Posts
          </Link>
        </div>
      )}
    </PageWrapper>
  )
}
