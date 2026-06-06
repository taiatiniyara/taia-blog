"use server"

import { db } from "@/db/client"
import { posts } from "@/db/schema"
import { eq, isNull, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { saveContent } from "@/lib/content-store"
import { uploadToR2 } from "@/lib/r2-client"
import { auth } from "@/lib/auth"

async function requireAuth() {
  const session = await auth()
  if (!session?.user || session.user.name !== process.env.ADMIN_GITHUB_USER) {
    throw new Error("Unauthorized")
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

export async function savePost(formData: FormData) {
  await requireAuth()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const tags = formData.get("tags") as string
  const series = formData.get("series") as string
  const published = formData.get("published") === "1" ? 1 : 0
  const contentJSON = formData.get("content") as string
  const existingId = formData.get("id") as string

  if (!title || !slug) throw new Error("Title and slug are required")

  const finalSlug = slug || generateSlug(title)
  const contentKey = `content/${finalSlug}.json`
  const now = new Date().toISOString()

  let parsed: unknown = null
  if (contentJSON) {
    try {
      parsed = JSON.parse(contentJSON)
    } catch {
      throw new Error("Invalid content JSON")
    }
  }

  if (existingId) {
    await db
      .update(posts)
      .set({
        title,
        slug: finalSlug,
        tags: tags || "",
        series: series || null,
        published,
        contentKey,
        updatedAt: now,
      })
      .where(eq(posts.id, parseInt(existingId, 10)))
      .run()
  } else {
    await db
      .insert(posts)
      .values({
        title,
        slug: finalSlug,
        tags: tags || "",
        series: series || null,
        published,
        contentKey,
        createdAt: now,
        updatedAt: now,
      })
      .run()
  }

  if (parsed) {
    await saveContent(finalSlug, parsed)
  }

  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath(`/blog/${finalSlug}`)
}

export async function deletePost(formData: FormData) {
  await requireAuth()

  const id = formData.get("id") as string
  if (!id) throw new Error("Post ID required")

  const now = new Date().toISOString()

  await db
    .update(posts)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(posts.id, parseInt(id, 10)))
    .run()

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function getAllPosts() {
  await requireAuth()

  return await db
    .select()
    .from(posts)
    .where(isNull(posts.deletedAt))
    .orderBy(desc(posts.updatedAt))
    .all()
}

export async function uploadImage(formData: FormData): Promise<string> {
  await requireAuth()

  const file = formData.get("file") as File | null
  if (!file) throw new Error("No file provided")

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "webp"
  const key = `images/${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const url = await uploadToR2(key, buffer, file.type || "image/webp")
  return url
}
