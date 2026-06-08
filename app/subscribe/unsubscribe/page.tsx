import { unsubscribe } from "@/lib/actions"
import { PageWrapper } from "@/components/page-wrapper"
import Link from "next/link"
import { LuMailMinus, LuMailX, LuMailQuestion } from "react-icons/lu"

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <PageWrapper>
        <div className="py-20 text-center">
          <LuMailQuestion size={40} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
          <h1 className="text-2xl font-bold mb-2">Missing token</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            No unsubscribe token provided.
          </p>
        </div>
      </PageWrapper>
    )
  }

  let succeeded = false
  try {
    await unsubscribe(token)
    succeeded = true
  } catch {
    succeeded = false
  }

  if (succeeded) {
    return (
      <PageWrapper>
        <div className="py-20 text-center">
          <LuMailMinus size={40} className="mx-auto mb-4 text-neutral-500 dark:text-neutral-400" />
          <h1 className="text-2xl font-bold mb-2">Unsubscribed</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            You&apos;ve been unsubscribed. You can re-subscribe anytime on the blog.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150"
          >
            &larr; Back to blog
          </Link>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="py-20 text-center">
        <LuMailX size={40} className="mx-auto mb-4 text-red-400" />
        <h1 className="text-2xl font-bold mb-2">Invalid or expired token</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          This unsubscribe link is no longer valid.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150"
        >
          &larr; Back to blog
        </Link>
      </div>
    </PageWrapper>
  )
}
