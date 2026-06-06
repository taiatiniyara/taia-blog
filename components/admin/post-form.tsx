"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { PostEditor } from "./post-editor"
import { savePost, deletePost, getPreviewUrl, sendPostToSubscribers } from "@/lib/actions"
import { useRouter } from "next/navigation"

type PostData = {
  id?: number
  slug?: string
  title?: string
  tags?: string
  series?: string | null
  published?: number
  content?: Record<string, unknown> | null
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

export function PostForm({ post }: { post?: PostData }) {
  const router = useRouter()
  const isNew = !post?.id

  const [title, setTitle] = useState(post?.title ?? "")
  const [slug, setSlug] = useState(post?.slug ?? "")
  const [tags, setTags] = useState(post?.tags ?? "")
  const [series, setSeries] = useState(post?.series ?? "")
  const [published, setPublished] = useState(post?.published === 1)
  const [content, setContent] = useState<Record<string, unknown> | null>(
    post?.content ?? null,
  )
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)
  const slugManualRef = useRef(false)

  const titleRef = useRef(title)
  const slugRef = useRef(slug)
  const tagsRef = useRef(tags)
  const seriesRef = useRef(series)
  const publishedRef = useRef(published)
  const contentRef = useRef(content)
  const postRef = useRef(post)

  useEffect(() => { titleRef.current = title }, [title])
  useEffect(() => { slugRef.current = slug }, [slug])
  useEffect(() => { tagsRef.current = tags }, [tags])
  useEffect(() => { seriesRef.current = series }, [series])
  useEffect(() => { publishedRef.current = published }, [published])
  useEffect(() => { contentRef.current = content }, [content])
  useEffect(() => { postRef.current = post }, [post])

  useEffect(() => {
    if (isNew && !slugManualRef.current && title) {
      setSlug(generateSlug(title))
    }
  }, [title, isNew])

  function handleSlugChange(value: string) {
    slugManualRef.current = true
    setSlug(value)
  }

  const doSave = useCallback(async (publishOverride?: boolean) => {
    setSaving(true)
    try {
      const currentTitle = titleRef.current
      const currentSlug = slugRef.current
      const currentTags = tagsRef.current
      const currentSeries = seriesRef.current
      const currentPublished = publishedRef.current
      const currentContent = contentRef.current
      const currentPost = postRef.current

      const formData = new FormData()
      if (currentPost?.id) formData.set("id", String(currentPost.id))
      formData.set("title", currentTitle)
      formData.set("slug", currentSlug || generateSlug(currentTitle))
      formData.set("tags", currentTags)
      formData.set("series", currentSeries)
      formData.set(
        "published",
        publishOverride !== undefined
          ? publishOverride
            ? "1"
            : "0"
          : currentPublished
            ? "1"
            : "0",
      )
      formData.set("content", currentContent ? JSON.stringify(currentContent) : "")
      const result = await savePost(formData)
      if (!currentPost?.id && result?.id) {
        const finalSlug = currentSlug || generateSlug(currentTitle)
        window.history.replaceState(null, "", `/admin?edit=${finalSlug}`)
      }
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }, [])

  const doSaveRef = useRef(doSave)
  useEffect(() => { doSaveRef.current = doSave }, [doSave])

  useEffect(() => {
    if (!isNew) return
    const interval = setInterval(() => {
      if (titleRef.current && contentRef.current) {
        doSaveRef.current()
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
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
            Title
          </label>
          <input
            type="text"
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            placeholder="life, thoughts, books"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
            Series{" "}
            <span className="font-normal text-neutral-400">(optional, one name)</span>
          </label>
          <input
            type="text"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            placeholder="e.g. My Thoughts on Philosophy"
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
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
          onChange={setContent}
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {!isNew && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
              >
                Delete
              </button>
              {published && (
                <button
                  type="button"
                  disabled={sending}
                  onClick={async () => {
                    setSending(true)
                    setSendResult(null)
                    try {
                      const finalSlug = slug || generateSlug(title)
                      const result = await sendPostToSubscribers(finalSlug)
                      setSendResult(`Sent to ${result.sent} subscriber${result.sent !== 1 ? "s" : ""}.`)
                    } catch {
                      setSendResult("Failed to send.")
                    } finally {
                      setSending(false)
                    }
                  }}
                  className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  {sending ? "Sending..." : "Send to subscribers"}
                </button>
              )}
              {sendResult && (
                <span className="text-xs text-neutral-500">{sendResult}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-xs text-neutral-400">Saving...</span>
          )}
          <button
            type="button"
            onClick={async () => {
              await doSave()
              const finalSlug = slug || generateSlug(title)
              const url = await getPreviewUrl(finalSlug)
              window.open(url, "_blank")
            }}
            className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => doSave()}
            className="px-4 py-2 text-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            {isNew ? "Save Draft" : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}
