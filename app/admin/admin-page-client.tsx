"use client"

import { useState, useMemo } from "react"
import { PostForm } from "@/components/admin/post-form"
import { SubscriberManager } from "@/components/admin/subscriber-manager"
import { formatDate } from "@/lib/format-date"
import Link from "next/link"

type Post = {
  id: number
  slug: string
  title: string
  tags: string | null
  series: string | null
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

type Subscriber = {
  id: number
  email: string
  confirmed: number | null
  createdAt: string
  unsubscribedAt: string | null
}

type SortField = "title" | "updatedAt" | "published"

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: "asc" | "desc" }) {
  if (field !== sortField) return <span className="ml-1 text-neutral-300 dark:text-neutral-600">&#8597;</span>
  return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
}

export function AdminPageClient({
  posts,
  editingPost,
  existingSeries,
  subscribers,
}: {
  posts: Post[]
  editingPost: EditingPost
  existingSeries: string[]
  subscribers: Subscriber[]
}) {
  const [editMode, setEditMode] = useState(!!editingPost)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [seriesFilter, setSeriesFilter] = useState("")
  const [sortField, setSortField] = useState<SortField>("updatedAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const allSeries = useMemo(() => {
    const set = new Set<string>()
    for (const p of posts) {
      if (p.series) set.add(p.series)
    }
    return Array.from(set).sort()
  }, [posts])

  const filtered = useMemo(() => {
    let result = [...posts]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.tags && p.tags.toLowerCase().includes(q)),
      )
    }

    if (statusFilter === "published") result = result.filter((p) => p.published)
    if (statusFilter === "draft") result = result.filter((p) => !p.published)

    if (seriesFilter) {
      result = result.filter((p) => p.series === seriesFilter)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortField === "title") {
        cmp = a.title.localeCompare(b.title)
      } else if (sortField === "published") {
        cmp = (a.published ?? 0) - (b.published ?? 0)
      } else {
        cmp = a.updatedAt.localeCompare(b.updatedAt)
      }
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [posts, search, statusFilter, seriesFilter, sortField, sortDir])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir(field === "published" ? "desc" : "asc")
    }
  }

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
        <PostForm post={postData} existingSeries={existingSeries} />
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
        <p className="text-neutral-500 dark:text-neutral-400 py-8 text-center text-sm">
          No posts yet.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or tags..."
              aria-label="Search posts"
              className="px-3 py-1.5 text-sm border rounded-lg bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 w-48"
            />

            <div className="flex items-center gap-1">
              {(["all", "published", "draft"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 text-xs rounded-full border ${
                    statusFilter === s
                      ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
                      : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {s === "all" ? "All" : s === "published" ? "Published" : "Drafts"}
                </button>
              ))}
            </div>

            {allSeries.length > 0 && (
              <select
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value)}
                aria-label="Filter by series"
                className="px-3 py-1.5 text-sm border rounded-lg bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
              >
                <option value="">All series</option>
                {allSeries.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            {filtered.length !== posts.length && (
              <span className="text-xs text-neutral-500">
                {filtered.length} of {posts.length} posts
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b text-left text-neutral-500 dark:text-neutral-400">
                  <th className="py-2 pr-4 font-medium">
                    <button
                      type="button"
                      onClick={() => handleSort("title")}
                      className="hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      Title
                      <SortIcon field="title" sortField={sortField} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="py-2 pr-4 font-medium">
                    <button
                      type="button"
                      onClick={() => handleSort("published")}
                      className="hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      Status
                      <SortIcon field="published" sortField={sortField} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="py-2 pr-4 font-medium hidden sm:table-cell">
                    <button
                      type="button"
                      onClick={() => handleSort("updatedAt")}
                      className="hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      Updated
                      <SortIcon field="updatedAt" sortField={sortField} sortDir={sortDir} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-b border-neutral-100 dark:border-neutral-800">
                    <td className="py-2 pr-4">
                      <Link
                        href={`/admin?edit=${post.slug}`}
                        className="text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400"
                      >
                        {post.title}
                      </Link>
                      {post.series && (
                        <span className="ml-2 text-xs text-neutral-400">{post.series}</span>
                      )}
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
        </>
      )}

      <SubscriberManager subscribers={subscribers} />
    </div>
  )
}
