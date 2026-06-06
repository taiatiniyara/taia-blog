const WORDS_PER_MINUTE = 200

export function readingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
