import { ImageResponse } from "@vercel/og"
import { loadGoogleFont } from "@/lib/og-font"

export const runtime = "nodejs"

export async function GET() {
  const text = "Taia's Blog Personal thoughts on things in general."
  const fontData = await loadGoogleFont("Geist", 600, text)

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: 80,
          backgroundColor: "#fafafa",
          fontFamily: "Geist",
          color: "#171717",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Taia&apos;s Blog
        </div>
        <div style={{ fontSize: 28, color: "#737373" }}>
          Personal thoughts on things in general.
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
