import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAllPosts } from "@/lib/actions"
import { loadContent } from "@/lib/content-store"
import { AdminPageClient } from "./admin-page-client"

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const { edit } = await searchParams
  const posts = await getAllPosts()

  let editingPost: {
    id: number
    slug: string
    title: string
    tags: string
    series: string | null
    published: number
    content: Record<string, unknown> | null
  } | null = null

  if (edit) {
    if (edit === "new") {
      editingPost = {
        id: 0,
          slug: "",
          title: "",
          tags: "",
          series: null,
          published: 0,
        content: null,
      }
    } else {
      const found = posts.find((p) => p.slug === edit)
      if (found) {
        const content = await loadContent(found.slug)
        editingPost = {
          id: found.id,
          slug: found.slug,
          title: found.title,
          tags: found.tags ?? "",
          series: found.series,
          published: found.published ?? 0,
          content,
        }
      }
    }
  }

  return <AdminPageClient posts={posts} editingPost={editingPost} />
}
