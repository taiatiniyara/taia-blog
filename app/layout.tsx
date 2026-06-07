import type { Metadata } from "next"
import { headers } from "next/headers"
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
})

const baseUrl = process.env.SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  title: {
    default: "Taia's Blog",
    template: "%s — Taia's Blog",
  },
  description: "Personal thoughts on things in general.",
  metadataBase: new URL(baseUrl),
  alternates: {
    types: {
      "application/rss+xml": `${baseUrl}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Taia's Blog",
    title: "Taia's Blog",
    description: "Personal thoughts on things in general.",
    images: [{ url: `${baseUrl}/og`, width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taia's Blog",
    description: "Personal thoughts on things in general.",
    images: [{ url: `${baseUrl}/og`, width: 1200, height: 630, type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const heads = await headers()
  const pathname = heads.get("x-pathname") ?? ""
  const isAdmin = pathname.startsWith("/admin")

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif4.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Taia's Blog",
              url: baseUrl,
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=document.cookie.match(/theme=([^;]+)/);if(t&&t[1]==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-neutral-900 dark:focus:bg-neutral-100 focus:text-white dark:focus:text-neutral-900 focus:rounded-lg"
        >
          Skip to content
        </a>
        <Header />
        <main className="flex-1 px-4 py-8" id="main-content">
          <Breadcrumbs />
          {children}
        </main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}
