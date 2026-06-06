import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <nav className="mx-auto max-w-5xl px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-semibold tracking-tight">
          Taia&apos;s Blog
        </Link>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <Link href="/series" className="hover:text-neutral-600 dark:hover:text-neutral-400">
            Series
          </Link>
          <Link href="/about" className="hover:text-neutral-600 dark:hover:text-neutral-400">
            About
          </Link>
        </div>
      </nav>
    </header>
  )
}
