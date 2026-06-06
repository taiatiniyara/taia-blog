import { notFound } from "next/navigation"
import { getPostBySlugPublished, getPostBySlug, getAdjacentPosts } from "@/lib/posts"
import { formatDate } from "@/lib/format-date"
import { PostNavigation } from "@/components/post-navigation"
import { loadContent } from "@/lib/content-store"
import { renderTiptapJSON } from "@/lib/tiptap-renderer"
import { getSeriesPosts } from "@/lib/posts"
import Link from "next/link"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlugPublished(slug)
  if (!post) return {}

  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000"

  return {
    title: post.title,
    description: post.title,
    openGraph: {
      title: post.title,
      description: post.title,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [`${baseUrl}/og-image.png`],
    },
  }
}

export default async function PostPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { preview } = await searchParams

  const isValidPreview =
    preview && preview === process.env.PREVIEW_TOKEN
  const post = isValidPreview
    ? await getPostBySlug(slug)
    : await getPostBySlugPublished(slug)

  if (!post) notFound()

  const { previous, next } = isValidPreview
    ? { previous: null, next: null }
    : await getAdjacentPosts(slug)

  const contentJSON = await loadContent(slug)
  const contentHTML = contentJSON ? renderTiptapJSON(contentJSON) : null

  const tags = post.tags
    ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <article>
      <header className="mb-8">
        {isValidPreview && !post.published && (
          <div className="mb-4 px-3 py-1.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 rounded-lg inline-block">
            Draft preview
          </div>
        )}
        <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.series && <SeriesNav series={post.series} currentSlug={slug} />}

      <div className="prose prose-neutral dark:prose-invert max-w-none font-serif">
        {contentHTML ? (
          <div dangerouslySetInnerHTML={{ __html: contentHTML }} />
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400 italic">
            This post has no content yet.
          </p>
        )}
      </div>

      <PostNavigation previous={previous} next={next} />
    </article>
  )
}

async function SeriesNav({
  series,
  currentSlug,
}: {
  series: string
  currentSlug: string
}) {
  const posts = await getSeriesPosts(series)
  if (posts.length < 2) return null

  const currentIndex = posts.findIndex((p) => p.slug === currentSlug)
  const previous = currentIndex > 0 ? posts[currentIndex - 1] : null
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  return (
    <div className="mb-8 p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          Series
        </span>
        <Link
          href={`/series/${encodeURIComponent(series)}`}
          className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          View all &rarr;
        </Link>
      </div>
      <Link
        href={`/series/${encodeURIComponent(series)}`}
        className="text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-600 dark:hover:text-neutral-400"
      >
        {series}
      </Link>
      <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
        {currentIndex + 1} of {posts.length}
      </span>
      {(previous || next) && (
        <div className="mt-3 flex items-center justify-between text-sm">
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              &larr; {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 text-right"
            >
              {next.title} &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
