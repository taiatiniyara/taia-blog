import type { Metadata } from "next"
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"
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
    images: [`${baseUrl}/og-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taia's Blog",
    description: "Personal thoughts on things in general.",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif4.variable}`}>
      <head>
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
        <Header />
        <main className="flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
      </body>
    </html>
  )
}
