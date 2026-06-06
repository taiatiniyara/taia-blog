import Link from "next/link"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-2xl px-4 py-5 sm:py-6 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
        <span>&copy; {year} Taia&apos;s Blog</span>
        <Link href="/feed.xml" className="hover:text-neutral-800 dark:hover:text-neutral-200">
          RSS
        </Link>
      </div>
    </footer>
  )
}
