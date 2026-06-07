"use client"

import { useState, useEffect, useRef } from "react"
import { PostEditor } from "./post-editor"
import { savePost, deletePost, getPreviewUrl } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { generateSlug } from "@/lib/utils"

type PostData = {
  id?: number
  slug?: string
  title?: string
  tags?: string
  series?: string | null
  published?: number
  content?: Record<string, unknown> | null
}


export function PostForm({ post, existingSeries }: { post?: PostData; existingSeries: string[] }) {
  const router = useRouter()
  const isNew = !post?.id

  const formRef = useRef<HTMLFormElement>(null)
  const contentRef = useRef<Record<string, unknown> | null>(post?.content ?? null)
  const [savedId, setSavedId] = useState<number | null>(null)

  const [title, setTitle] = useState(post?.title ?? "")
  const [slug, setSlug] = useState(post?.slug ?? "")
  const [tags, setTags] = useState(post?.tags ?? "")
  const [series, setSeries] = useState(post?.series ?? "")
  const [published, setPublished] = useState(post?.published === 1)
  const [saving, setSaving] = useState(false)
  const [seriesOpen, setSeriesOpen] = useState(false)
  const [seriesHighlight, setSeriesHighlight] = useState(-1)
  const slugManualRef = useRef(false)
  const seriesInputRef = useRef<HTMLInputElement>(null)
  const seriesListRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (isNew && !slugManualRef.current && title) {
      setSlug(generateSlug(title))
    }
  }, [title, isNew])

  function handleSlugChange(value: string) {
    slugManualRef.current = true
    setSlug(value)
  }

  async function handleSave(publishOverride?: boolean) {
    if (!formRef.current) return
    setSaving(true)
    try {
      const fd = new FormData(formRef.current)
      if (!fd.get("slug")) {
        fd.set("slug", generateSlug(fd.get("title") as string))
      }
      fd.set(
        "published",
        publishOverride !== undefined
          ? publishOverride
            ? "1"
            : "0"
          : published
            ? "1"
            : "0",
      )
      fd.set("content", contentRef.current ? JSON.stringify(contentRef.current) : "")
      const result = await savePost(fd)
      if (!post?.id && result?.id) {
        setSavedId(result.id)
        const finalSlug = (fd.get("slug") as string) || generateSlug(fd.get("title") as string)
        window.history.replaceState(null, "", `/admin?edit=${finalSlug}`)
      }
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }

  const saveRef = useRef(handleSave)
  useEffect(() => { saveRef.current = handleSave })

  useEffect(() => {
    if (!isNew) return
    const interval = setInterval(() => {
      if (!formRef.current) return
      const fd = new FormData(formRef.current)
      if (fd.get("title") && contentRef.current) {
        saveRef.current()
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [isNew])

  async function handleDelete() {
    if (!post?.id) return
    if (!confirm("Delete this post?")) return
    const formData = new FormData()
    formData.set("id", String(post.id))
    await deletePost(formData)
    router.push("/admin")
    router.refresh()
  }

  return (
    <form
      ref={formRef}
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        handleSave()
      }}
    >
      <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
            >
              Delete
            </button>
          )}

        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-xs text-neutral-400">Saving...</span>
          )}
          <button
            type="button"
            onClick={async () => {
              await handleSave()
              const finalSlug = slug || generateSlug(title)
              const url = await getPreviewUrl(finalSlug)
              window.open(url, "_blank")
            }}
            className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            Preview
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            {isNew ? "Save Draft" : "Save"}
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 font-mono"
            placeholder="post-slug"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
            Tags{" "}
            <span className="font-normal text-neutral-400">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            placeholder="life, thoughts, books"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
            Series{" "}
            <span className="font-normal text-neutral-400">(optional, one name)</span>
          </label>
          <input
            ref={seriesInputRef}
            type="text"
            name="series"
            value={series}
            onChange={(e) => {
              setSeries(e.target.value)
              setSeriesOpen(true)
              setSeriesHighlight(-1)
            }}
            onFocus={() => {
              setSeriesOpen(true)
              setSeriesHighlight(-1)
            }}
            onBlur={() => {
              setTimeout(() => setSeriesOpen(false), 150)
            }}
            onKeyDown={(e) => {
              const matches = existingSeries.filter((s) =>
                s.toLowerCase().includes(series.toLowerCase()) && s !== series,
              )
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setSeriesHighlight((prev) =>
                  prev < matches.length - 1 ? prev + 1 : 0,
                )
              } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setSeriesHighlight((prev) =>
                  prev > 0 ? prev - 1 : matches.length - 1,
                )
              } else if (e.key === "Enter" && seriesHighlight >= 0 && seriesHighlight < matches.length) {
                e.preventDefault()
                setSeries(matches[seriesHighlight])
                setSeriesOpen(false)
              } else if (e.key === "Escape") {
                setSeriesOpen(false)
              }
            }}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            placeholder="e.g. My Thoughts on Philosophy"
            autoComplete="off"
          />
          {seriesOpen && (() => {
            const matches = existingSeries.filter((s) =>
              s.toLowerCase().includes(series.toLowerCase()) && s !== series,
            )
            if (matches.length === 0 && !series) return null
            return (
              <ul
                ref={seriesListRef}
                className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto border rounded-lg bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 shadow-lg"
              >
                {matches.map((s, i) => (
                  <li key={s}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setSeries(s)
                        setSeriesOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                        i === seriesHighlight
                          ? "bg-neutral-100 dark:bg-neutral-800"
                          : ""
                      }`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
                {series && !existingSeries.includes(series) && (
                  <li>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setSeriesOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-800 ${
                        seriesHighlight === matches.length
                          ? "bg-neutral-100 dark:bg-neutral-800"
                          : ""
                      }`}
                    >
                      Create &ldquo;{series}&rdquo;
                    </button>
                  </li>
                )}
              </ul>
            )
          })()}
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded"
          />
          <span className="text-neutral-700 dark:text-neutral-300">Published</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
          Content
        </label>
        <PostEditor
          initialContent={post?.content ?? undefined}
          onChange={(json) => {
            contentRef.current = json
          }}
        />
      </div>

      <input type="hidden" name="id" value={post?.id ?? savedId ?? ""} />
    </form>
  )
}
