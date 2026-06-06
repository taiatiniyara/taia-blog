import type { Post } from "./posts"

export function getExcerpt(post: Post, maxLength = 200): string {
  const tags = post.tags
  const title = post.title

  if (!tags) return title.slice(0, maxLength)

  const plain = tags.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
  if (plain.length <= maxLength) return plain
  return plain.slice(0, maxLength).replace(/\s+\S*$/, "") + "..."
}
