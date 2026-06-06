import { PostCard } from "./post-card"
import type { Post } from "@/lib/posts"

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
        No posts yet.
      </div>
    )
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
