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
    keyExt = ext
  }

  const key = `images/${id}.${keyExt}`
  const url = await uploadToR2(key, uploadBuffer, contentType)

  return Response.json({ url })
}
