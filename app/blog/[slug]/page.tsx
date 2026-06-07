import { notFound } from "next/navigation"
import { getPostBySlugPublished, getPostBySlug, getAdjacentPosts, getPublishedPosts, getSeriesPosts } from "@/lib/posts"
import { formatDate } from "@/lib/format-date"
import { PostNavigation } from "@/components/post-navigation"
import { ShareButtons } from "@/components/share-buttons"
import { loadContent } from "@/lib/content-store"
import { renderTiptapJSON } from "@/lib/tiptap-renderer"
import { extractText, getSiteUrl, splitTags } from "@/lib/utils"
import Link from "next/link"
import { LuChevronLeft, LuChevronRight, LuCalendar, LuList, LuLayers } from "react-icons/lu"
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

  const content = await loadContent(slug)
  const description = extractText(content, 160) || post.title

  const baseUrl = getSiteUrl()

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
    authors: [{ name: "Taia" }],
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [{ url: `${baseUrl}/og/blog/${post.slug}`, width: 1200, height: 630, type: "image/png" }],
      tags: splitTags(post.tags),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [{ url: `${baseUrl}/og/blog/${post.slug}`, width: 1200, height: 630 }],
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

  const recentPosts = await getPublishedPosts(1)
  const sidebarPosts = recentPosts.filter((p) => p.slug !== slug).slice(0, 5)

  const { previous, next } = isValidPreview
    ? { previous: null, next: null }
    : await getAdjacentPosts(slug)

  const contentJSON = await loadContent(slug)
  const contentHTML = contentJSON ? renderTiptapJSON(contentJSON) : null

  const tags = splitTags(post.tags)
  const baseUrl = getSiteUrl()

  return (
    <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
      <article>
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.createdAt,
            dateModified: post.updatedAt,
            author: {
              "@type": "Person",
              name: "Taia",
            },
            url: `${baseUrl}/blog/${post.slug}`,
            ...(tags.length > 0 && { keywords: tags.join(", ") }),
          }),
        }}
      />
      <header className="mb-8">
        {isValidPreview && !post.published && (
          <div className="mb-4 px-3 py-1.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 rounded-lg inline-block">
            Draft preview
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
          <LuCalendar size={14} />
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          {post.series && (
            <>
              <span aria-hidden="true">&middot;</span>
              <Link
                href={`/series/${encodeURIComponent(post.series)}`}
                className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <LuLayers size={14} />
                <span>{post.series}</span>
              </Link>
            </>
          )}
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

      <ShareButtons
        url={`${baseUrl}/blog/${post.slug}`}
        title={post.title}
      />
      <PostNavigation previous={previous} next={next} />
    </article>

    {sidebarPosts.length > 0 && (
      <aside className="mt-10 lg:mt-0 lg:block">
        <div className="lg:sticky lg:top-8">
          <h3 className="text-sm font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-4 inline-flex items-center gap-1.5">
            <LuList size={14} />
            Recent Posts
          </h3>
          <ul className="space-y-3">
            {sidebarPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 leading-snug line-clamp-2"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {formatDate(p.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      )}
  </div>
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
        <div className="mt-3 flex items-center justify-between text-xs sm:text-sm">
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 max-w-[48%] truncate inline-flex items-center gap-1"
            >
              <LuChevronLeft size={14} className="shrink-0" /> {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 text-right max-w-[48%] truncate inline-flex items-center gap-1"
            >
              {next.title} <LuChevronRight size={14} className="shrink-0" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
