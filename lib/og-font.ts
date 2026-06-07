const cache = new Map<string, ArrayBuffer>()

export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer> {
  const key = `${family}:${weight}:${text}`
  const cached = cache.get(key)
  if (cached) return cached

  const url = new URL("https://fonts.googleapis.com/css2")
  url.searchParams.set("family", `${family}:wght@${weight}`)
  url.searchParams.set("text", text)

  const css = await fetch(url.toString()).then((r) => r.text())
  const match = css.match(/url\(([^)]+)\)/)
  const fontUrl = match?.[1]
  if (!fontUrl) throw new Error(`Failed to load font: ${family} ${weight}`)

  const buffer = await fetch(fontUrl).then((r) => r.arrayBuffer())
  cache.set(key, buffer)
  return buffer
}
