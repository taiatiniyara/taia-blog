import { uploadToR2, getFromR2 } from "./r2-client"

export function getContentKey(slug: string): string {
  return `content/${slug}.json`
}

export async function saveContent(slug: string, json: unknown): Promise<void> {
  const key = getContentKey(slug)
  const content = JSON.stringify(json)
  await uploadToR2(key, Buffer.from(content, "utf-8"), "application/json")
}

export async function loadContent(slug: string): Promise<Record<string, unknown> | null> {
  const key = getContentKey(slug)
  const raw = await getFromR2(key)
  if (!raw) return null
  return JSON.parse(raw)
}

export async function deleteContent(_slug: string): Promise<void> {
  void _slug
}
