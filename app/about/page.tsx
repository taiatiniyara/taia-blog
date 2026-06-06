import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
}

export default function AboutPage() {
  return (
    <article>
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-6">About</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Welcome to Taia&apos;s Blog. This is where I write about things that interest me.
        </p>
      </div>
    </article>
  )
}
