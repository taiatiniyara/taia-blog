export function getSiteUrl(): string {
  return process.env.SITE_URL ?? "http://localhost:3000"
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

export function splitTags(tags: string | null | undefined): string[] {
  if (!tags) return []
  return tags.split(",").map((t) => t.trim()).filter(Boolean)
}

export function extractText(
  content: Record<string, unknown> | null | undefined,
  maxLength = 200,
): string {
  if (!content) return ""

  const walk = (node: unknown): string => {
    if (typeof node === "string") return node
    if (Array.isArray(node)) return node.map(walk).join(" ")
    if (node && typeof node === "object" && "text" in node)
      return String((node as Record<string, unknown>).text)
    if (node && typeof node === "object" && "content" in node)
      return walk((node as Record<string, unknown>).content)
    return ""
  }

  const text = walk(content)
  return text.replace(/\s+/g, " ").trim().slice(0, maxLength).replace(/\s+\S*$/, "")
}

export function extractFirstImage(
  content: Record<string, unknown> | null | undefined,
): string | null {
  if (!content) return null

  const walk = (node: unknown): string | null => {
    if (!node || typeof node !== "object") return null
    const obj = node as Record<string, unknown>
    if (obj.type === "image" && obj.attrs && typeof obj.attrs === "object") {
      const attrs = obj.attrs as Record<string, unknown>
      const src = attrs.src
      if (typeof src === "string") return src
    }
    if ("content" in obj) {
      const children = obj.content
      if (Array.isArray(children)) {
        for (const child of children) {
          const result = walk(child)
          if (result) return result
        }
      }
    }
    return null
  }

  return walk(content)
}
