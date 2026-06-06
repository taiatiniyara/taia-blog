"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold">Oops</h1>
      <p className="mt-4 text-neutral-500 dark:text-neutral-400">
        Something went wrong.
      </p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          &larr; Home
        </Link>
      </div>
    </div>
  )
}
