import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { cookies } from "next/headers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
});

const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "taia.blog",
    template: "%s — taia.blog",
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
    siteName: "taia.blog",
    title: "taia.blog",
    description: "Personal thoughts on things in general.",
    images: [`${baseUrl}/og-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "taia.blog",
    description: "Personal thoughts on things in general.",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  const isDark = theme === "dark";

  return (
    <html
      lang="en"
      className={`${isDark ? "dark" : ""} ${geistSans.variable} ${geistMono.variable} ${sourceSerif4.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8">
          {children}
        </main>
        <Footer />
        <div className="fixed bottom-4 right-4">
          <ThemeToggle />
        </div>
      </body>
    </html>
  );
}
