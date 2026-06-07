import { db } from "@/db/client"
import { posts } from "@/db/schema"
import { eq, and, isNull, like, sql, desc, asc } from "drizzle-orm"
import { loadContent } from "@/lib/content-store"
import { extractText } from "@/lib/utils"

const POSTS_PER_PAGE = 10

export type Post = typeof posts.$inferSelect

export async function getPublishedPosts(page = 1, sort: "newest" | "oldest" = "newest") {
  const order = sort === "oldest" ? asc(posts.createdAt) : desc(posts.createdAt)
  const offset = (page - 1) * POSTS_PER_PAGE
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.published, 1), isNull(posts.deletedAt)))
    .orderBy(order)
    .limit(POSTS_PER_PAGE)
    .offset(offset)
    .all()

  return result
}

export async function getPostBySlug(slug: string) {
  return await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), isNull(posts.deletedAt)))
    .get()
}

export async function getPostBySlugPublished(slug: string) {
  return await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, 1), isNull(posts.deletedAt)))
    .get()
}

export async function getPostBySlugWithPreview(slug: string, previewToken: string) {
  if (previewToken === process.env.PREVIEW_TOKEN) {
    return await getPostBySlug(slug)
  }
  return await getPostBySlugPublished(slug)
}

export async function countPublishedPosts() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(and(eq(posts.published, 1), isNull(posts.deletedAt)))
    .get()
  return result?.count ?? 0
}

export async function totalPages() {
  const count = await countPublishedPosts()
  return Math.ceil(count / POSTS_PER_PAGE) || 1
}

export async function getAllPublishedSlugs() {
  return await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(and(eq(posts.published, 1), isNull(posts.deletedAt)))
    .all()
}

export async function getPostsByTag(tag: string, page = 1) {
  const offset = (page - 1) * POSTS_PER_PAGE
  return await db
    .select()
    .from(posts)
    .where(and(eq(posts.published, 1), isNull(posts.deletedAt), like(posts.tags, `%${tag}%`)))
    .orderBy(desc(posts.createdAt))
    .limit(POSTS_PER_PAGE)
    .offset(offset)
    .all()
}

export async function getAllTags() {
  const all = await db
    .select({ tags: posts.tags })
    .from(posts)
    .where(and(eq(posts.published, 1), isNull(posts.deletedAt)))
    .all()
  const tagSet = new Set<string>()
  for (const row of all) {
    if (!row.tags) continue
    for (const t of row.tags.split(",")) {
      const trimmed = t.trim()
      if (trimmed) tagSet.add(trimmed)
    }
  }
  return Array.from(tagSet).sort()
}

export type SeriesPost = {
  slug: string
  title: string
  createdAt: string
}

export async function getAllSeries(): Promise<string[]> {
  const all = await db
    .selectDistinct({ series: posts.series })
    .from(posts)
    .where(
      and(
        eq(posts.published, 1),
        isNull(posts.deletedAt),
      ),
    )
    .all()
  return all
    .map((r) => r.series)
    .filter((s): s is string => s !== null && s !== "")
    .sort()
}

export async function getSeriesPosts(seriesName: string): Promise<SeriesPost[]> {
  return await db
    .select({
      slug: posts.slug,
      title: posts.title,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.published, 1),
        isNull(posts.deletedAt),
        eq(posts.series, seriesName),
      ),
    )
    .orderBy(posts.createdAt)
    .all()
}

export async function getAdjacentPosts(slug: string) {
  const post = await getPostBySlugPublished(slug)
  if (!post) return { previous: null, next: null }

  const allPosts = await db
    .select({ slug: posts.slug, title: posts.title })
    .from(posts)
    .where(and(eq(posts.published, 1), isNull(posts.deletedAt)))
    .orderBy(desc(posts.createdAt))
    .all()

  const idx = allPosts.findIndex((p) => p.slug === slug)
  const previous = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const next = idx > 0 ? allPosts[idx - 1] : null

  return { previous, next }
}

export async function loadExcerpts(
  posts: Awaited<ReturnType<typeof getPublishedPosts>>,
): Promise<Map<string, string | null>> {
  const excerpts = new Map<string, string | null>()
  const results = await Promise.allSettled(
    posts.map(async (post) => {
      const content = await loadContent(post.slug)
      return { slug: post.slug, excerpt: content ? extractText(content, 200) : null }
    }),
  )
  for (const result of results) {
    if (result.status === "fulfilled") {
      excerpts.set(result.value.slug, result.value.excerpt)
    }
  }
  return excerpts
}
