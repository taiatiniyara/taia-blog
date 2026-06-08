"use client"

import { useEffect } from "react"
import Link from "next/link"
import { LuTriangleAlert, LuChevronLeft } from "react-icons/lu"
import { PageWrapper } from "@/components/page-wrapper"

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
    <PageWrapper>
      <div className="py-20 text-center">
        <LuTriangleAlert size={40} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
        <h1 className="text-4xl font-bold">Oops</h1>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">
          Something went wrong.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1"
          >
            <LuChevronLeft size={14} /> Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}
