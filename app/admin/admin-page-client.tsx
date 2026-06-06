"use client"

import { useState } from "react"
import { PostForm } from "@/components/admin/post-form"
import { formatDate } from "@/lib/format-date"
import Link from "next/link"

type Post = {
  id: number
  slug: string
  title: string
  tags: string | null
  published: number | null
  createdAt: string
  updatedAt: string
}

type EditingPost = {
  id: number
  slug: string
  title: string
  tags: string
  series: string | null
  published: number
  content: Record<string, unknown> | null
} | null

export function AdminPageClient({
  posts,
  editingPost,
}: {
  posts: Post[]
  editingPost: EditingPost
}) {
  const [editMode, setEditMode] = useState(!!editingPost)

  if (editMode) {
    const postData = editingPost?.id
      ? {
          id: editingPost.id,
          slug: editingPost.slug,
          title: editingPost.title,
          tags: editingPost.tags,
          series: editingPost.series,
          published: editingPost.published,
          content: editingPost.content ?? null,
        }
      : undefined

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            {editingPost?.id && editingPost.id !== 0 ? "Edit Post" : "New Post"}
          </h1>
          <Link
            href="/admin"
            onClick={() => setEditMode(false)}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            &larr; Back to list
          </Link>
        </div>
        <PostForm post={postData} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link
          href="/admin?edit=new"
          className="px-4 py-2 text-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400 py-8 text-center">
          No posts yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-neutral-500 dark:text-neutral-400">
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium hidden sm:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-neutral-100 dark:border-neutral-800">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin?edit=${post.slug}`}
                      className="text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        post.published
                          ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                          : "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">
                    {formatDate(post.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
