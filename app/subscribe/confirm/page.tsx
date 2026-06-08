import { confirmSubscription } from "@/lib/actions"
import { PageWrapper } from "@/components/page-wrapper"
import Link from "next/link"
import { LuMailCheck, LuMailX, LuMailQuestion } from "react-icons/lu"

export default async function ConfirmPage({
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
            No confirmation token provided.
          </p>
        </div>
      </PageWrapper>
    )
  }

  let succeeded = false
  try {
    await confirmSubscription(token)
    succeeded = true
  } catch {
    succeeded = false
  }

  if (succeeded) {
    return (
      <PageWrapper>
        <div className="py-20 text-center">
          <LuMailCheck size={40} className="mx-auto mb-4 text-emerald-500" />
          <h1 className="text-2xl font-bold mb-2">You&apos;re subscribed!</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            You&apos;ll now receive new posts from Taia&apos;s Blog by email.
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
          This confirmation link is no longer valid.
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
