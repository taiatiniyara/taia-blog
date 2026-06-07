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
