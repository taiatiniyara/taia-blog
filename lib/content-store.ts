import { uploadToR2, getFromR2 } from "./r2-client"

export async function saveContent(slug: string, json: unknown): Promise<void> {
  const key = `content/${slug}.json`
  const content = JSON.stringify(json)
  await uploadToR2(key, Buffer.from(content, "utf-8"), "application/json")
}

export async function loadContent(slug: string): Promise<Record<string, unknown> | null> {
  const key = `content/${slug}.json`
  const raw = await getFromR2(key)
  if (!raw) return null
  return JSON.parse(raw)
}
