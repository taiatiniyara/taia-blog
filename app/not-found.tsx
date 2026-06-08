import Link from "next/link"
import { LuFileQuestion } from "react-icons/lu"
import { PageWrapper } from "@/components/page-wrapper"

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="py-20 text-center">
      <LuFileQuestion size={40} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-neutral-500 dark:text-neutral-400">
        Page not found.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150"
      >
        &larr; Home
      </Link>
      </div>
    </PageWrapper>
  )
}
