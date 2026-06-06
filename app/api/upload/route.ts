import { auth } from "@/lib/auth"
import { uploadToR2 } from "@/lib/r2-client"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.name?.toLowerCase() !== process.env.ADMIN_GITHUB_USER?.toLowerCase()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 })
  }

  const ext = file.name.split(".").filter(Boolean).pop()?.toLowerCase()
    || file.type.split("/").pop()
    || "bin"
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  const key = `images/${id}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const url = await uploadToR2(key, buffer, file.type || "image/octet-stream")

  return Response.json({ url })
}
