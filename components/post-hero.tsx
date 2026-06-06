import Link from "next/link"
import type { Post } from "@/lib/posts"
import { formatDate } from "@/lib/format-date"

export function PostHero({ post, excerpt }: { post: Post; excerpt?: string }) {
  const tags = post.tags
    ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <article className="pb-10 border-b border-neutral-200 dark:border-neutral-800">
      <Link href={`/blog/${post.slug}`} className="group">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-400">
          {post.title}
        </h1>
      </Link>
      <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
      </div>
      {excerpt && (
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      )}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
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
