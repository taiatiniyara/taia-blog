import Link from "next/link"
import type { Post } from "@/lib/posts"
import { formatDate } from "@/lib/format-date"

export function PostCard({
  post,
  compact = false,
  excerpt,
}: {
  post: Post
  compact?: boolean
  excerpt?: string
}) {
  const tags = post.tags
    ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <article className={compact ? "" : "py-6 border-b border-neutral-100 dark:border-neutral-800 first:pt-0 last:border-0"}>
      <Link href={`/blog/${post.slug}`} className="group">
        <h2 className="text-lg font-semibold leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-400">
          {post.title}
        </h2>
      </Link>
      <div className="mt-1 flex items-center gap-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
      </div>
      {excerpt && (
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
          {excerpt}
        </p>
      )}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
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
    </article>
  )
}
