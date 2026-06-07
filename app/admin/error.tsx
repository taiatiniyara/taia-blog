"use client"

import { useEffect } from "react"
import Link from "next/link"
import { LuTriangleAlert, LuArrowLeft } from "react-icons/lu"

export default function AdminError({
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-end mb-6">
        <Link
          href="/admin"
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1"
        >
          <LuArrowLeft size={14} />
          Back to admin
        </Link>
      </div>
      <div className="py-20 text-center">
        <LuTriangleAlert size={40} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400 text-sm">
          {error.message || "An unexpected error occurred in the admin area."}
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Try again
          </button>
          <Link
            href="/admin"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
