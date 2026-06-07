import { ImageResponse } from "@vercel/og"
import { getPostBySlugPublished } from "@/lib/posts"
import { formatDate } from "@/lib/format-date"
import { loadContent } from "@/lib/content-store"
import { loadGoogleFont } from "@/lib/og-font"
import { extractText } from "@/lib/utils"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const post = await getPostBySlugPublished(slug)
  if (!post) return new Response("Not found", { status: 404 })

  const content = await loadContent(slug)
  const description = extractText(content, 200)
  const date = formatDate(post.createdAt)
  const siteName = "Taia's Blog"

  const text = post.title + description + date + siteName
  const fontData = await loadGoogleFont("Geist", 600, text)

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 80,
          backgroundColor: "#fafafa",
          fontFamily: "Geist",
          color: "#171717",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 24, color: "#a3a3a3", fontWeight: 500 }}>
            {date}
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {post.title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 28,
                color: "#737373",
                lineHeight: 1.4,
                maxWidth: "90%",
              }}
            >
              {description}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 600, color: "#404040" }}>
            {siteName}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          style: "normal",
          weight: 600,
        },
      ],
      headers: {
        "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    },
  )
}
