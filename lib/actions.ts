"use server"

import { db } from "@/db/client"
import { posts, subscribers } from "@/db/schema"
import { eq, isNull, desc, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { saveContent, loadContent } from "@/lib/content-store"
import { uploadToR2 } from "@/lib/r2-client"
import { auth } from "@/lib/auth"
import { sendEmail, isEmailConfigured } from "@/lib/email"
import { postEmailTemplate } from "@/lib/email-template"
import { generateSlug, extractText, getSiteUrl } from "@/lib/utils"

async function requireAuth() {
  const session = await auth()
  if (!session?.user || session.user.name?.toLowerCase() !== process.env.ADMIN_GITHUB_USER?.toLowerCase()) {
    throw new Error("Unauthorized")
  }
}

export async function savePost(formData: FormData) {
  try {
    await requireAuth()

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const tags = formData.get("tags") as string
    const series = formData.get("series") as string
    const published = formData.get("published") === "1" ? 1 : 0
    const contentJSON = formData.get("content") as string
    const existingId = formData.get("id") as string

    console.error("[savePost] title=%s slug=%s existingId=%s", title || "(empty)", slug || "(empty)", existingId || "(none)")

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

    let postId: number

    if (existingId) {
      postId = parseInt(existingId, 10)
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
        .where(eq(posts.id, postId))
        .run()
    } else {
      const existingSlug = await db
        .select({ id: posts.id })
        .from(posts)
        .where(and(eq(posts.slug, finalSlug), isNull(posts.deletedAt)))
        .get()

      if (existingSlug) {
        postId = existingSlug.id
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
          .where(eq(posts.id, postId))
          .run()
      } else {
        const result = await db
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
          .returning({ id: posts.id })
        postId = result[0].id
      }
    }

    if (parsed) {
      await saveContent(finalSlug, parsed)
    }

    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath(`/blog/${finalSlug}`)

    if (!existingId && published === 1) {
      sendPostToSubscribers(finalSlug).then(
        (result) => console.error("[savePost] Auto-sent to %d subscribers", result.total),
        (err) => console.error("[savePost] Auto-send failed:", err instanceof Error ? err.message : String(err)),
      )
    }

    return { id: postId }
  } catch (err) {
    console.error("[savePost] ERROR:", err instanceof Error ? err.message : String(err))
    console.error("[savePost] STACK:", err instanceof Error ? err.stack : "")
    throw err
  }
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

  const buffer = Buffer.from(await file.arrayBuffer())

  let uploadBuffer: Buffer
  let contentType: string
  let keyExt: string

  try {
    const sharp = (await import("sharp")).default
    uploadBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer()
    contentType = "image/webp"
    keyExt = "webp"
  } catch {
    uploadBuffer = buffer
    contentType = file.type || "image/octet-stream"
    keyExt = file.name.split(".").filter(Boolean).pop()?.toLowerCase() || file.type.split("/").pop() || "bin"
  }

  const key = `images/${crypto.randomUUID()}.${keyExt}`
  const url = await uploadToR2(key, uploadBuffer, contentType)

  console.error("[uploadImage] %s (%d bytes) → %s", file.name, file.size, url)
  return url
}

export async function getPreviewUrl(slug: string): Promise<string> {
  await requireAuth()

  const token = process.env.PREVIEW_TOKEN ?? ""
  return `${getSiteUrl()}/blog/${slug}?preview=${token}`
}

export async function subscribe(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  if (!email || !email.includes("@")) {
    throw new Error("Valid email required")
  }

  const existing = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.email, email))
    .get()

  if (existing && existing.confirmed && !existing.unsubscribedAt) {
    return { status: "already_subscribed" as const }
  }

  const token = crypto.randomUUID()
  const now = new Date().toISOString()

  if (existing) {
    await db
      .update(subscribers)
      .set({ token, confirmed: 0, unsubscribedAt: null, createdAt: now })
      .where(eq(subscribers.email, email))
      .run()
  } else {
    await db
      .insert(subscribers)
      .values({ email, token, createdAt: now })
      .run()
  }

  const siteUrl = getSiteUrl()
  const confirmUrl = `${siteUrl}/subscribe/confirm?token=${token}`

  await sendEmail({
    to: email,
    subject: "Confirm your subscription — Taia's Blog",
    html: `<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;max-width:480px;margin:40px auto;color:#171717;">
  <p style="font-size:14px;color:#6b7280;">Taia's Blog</p>
  <h1 style="font-size:22px;margin:8px 0;">Confirm your subscription</h1>
  <p style="font-size:15px;line-height:1.6;color:#374151;">Click the button below to confirm you want to receive new posts by email.</p>
  <a href="${confirmUrl}" style="display:inline-block;padding:10px 24px;background:#171717;color:white;text-decoration:none;border-radius:6px;font-size:14px;margin-top:8px;">Confirm subscription</a>
  <p style="font-size:13px;color:#6b7280;margin-top:24px;">If you didn't request this, you can ignore this email.</p>
</body>
</html>`,
  })

  return { status: "confirmation_sent" as const }
}

export async function confirmSubscription(token: string) {
  const sub = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.token, token))
    .get()

  if (!sub) throw new Error("Invalid confirmation token")

  await db
    .update(subscribers)
    .set({ confirmed: 1 })
    .where(eq(subscribers.id, sub.id))
    .run()

  return { email: sub.email }
}

export async function unsubscribe(token: string) {
  const sub = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.token, token))
    .get()

  if (!sub) throw new Error("Invalid token")

  await db
    .update(subscribers)
    .set({ unsubscribedAt: new Date().toISOString() })
    .where(eq(subscribers.id, sub.id))
    .run()
}

export async function sendPostToSubscribers(slug: string) {
  await requireAuth()

  if (!isEmailConfigured()) {
    throw new Error("SMTP not configured")
  }

  const post = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), isNull(posts.deletedAt)))
    .get()

  if (!post) throw new Error("Post not found")

  const content = await loadContent(slug)
  const excerpt = extractText(content, 280)

  const subs = await db
    .select()
    .from(subscribers)
    .where(and(eq(subscribers.confirmed, 1), isNull(subscribers.unsubscribedAt)))
    .all()

  if (subs.length === 0) throw new Error("No confirmed subscribers")

  const siteUrl = getSiteUrl()

  Promise.allSettled(
    subs.map((sub) => {
      const html = postEmailTemplate({
        title: post.title,
        slug: post.slug,
        excerpt: excerpt || post.title,
        date: post.createdAt,
        unsubscribeUrl: `${siteUrl}/subscribe/unsubscribe?token=${sub.token}`,
      })
      return sendEmail({
        to: sub.email,
        subject: post.title,
        html,
      })
    }),
  )

  return { total: subs.length }
}

export async function getAllSubscribers() {
  await requireAuth()

  return await db
    .select()
    .from(subscribers)
    .orderBy(desc(subscribers.createdAt))
    .all()
}

export async function addSubscriber(formData: FormData) {
  await requireAuth()

  const email = (formData.get("email") as string)?.trim().toLowerCase()
  if (!email || !email.includes("@")) {
    throw new Error("Valid email required")
  }

  const existing = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.email, email))
    .get()

  if (existing && existing.confirmed && !existing.unsubscribedAt) {
    return { status: "already_subscribed" as const }
  }

  const token = crypto.randomUUID()
  const now = new Date().toISOString()

  if (existing) {
    await db
      .update(subscribers)
      .set({ token, confirmed: 1, unsubscribedAt: null, createdAt: now })
      .where(eq(subscribers.email, email))
      .run()
  } else {
    await db
      .insert(subscribers)
      .values({ email, token, confirmed: 1, createdAt: now })
      .run()
  }

  revalidatePath("/admin")
  return { status: "added" as const, email }
}

export async function removeSubscriber(formData: FormData) {
  await requireAuth()

  const id = formData.get("id") as string
  if (!id) throw new Error("Subscriber ID required")

  await db
    .update(subscribers)
    .set({ unsubscribedAt: new Date().toISOString() })
    .where(eq(subscribers.id, parseInt(id, 10)))
    .run()

  revalidatePath("/admin")
}
