import Link from "next/link"
import { LuRss } from "react-icons/lu"
import { SubscribeForm } from "./subscribe-form"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Subscribe by email
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
            Get new posts delivered to your inbox.
          </p>
          <SubscribeForm />
        </div>
        <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <span>&copy; {year} Taia&apos;s Blog</span>
          <Link href="/feed.xml" className="hover:text-neutral-800 dark:hover:text-neutral-200 inline-flex items-center gap-1 transition-colors duration-150">
            <LuRss size={14} />
            RSS
          </Link>
        </div>
      </div>
    </footer>
  )
}
