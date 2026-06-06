import { confirmSubscription } from "@/lib/actions"

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Missing token</h1>
        <p className="text-neutral-500">No confirmation token provided.</p>
      </div>
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
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">You&apos;re subscribed!</h1>
        <p className="text-neutral-500">
          You&apos;ll now receive new posts from Taia&apos;s Blog by email.
        </p>
      </div>
    )
  }

  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Invalid or expired token</h1>
      <p className="text-neutral-500">
        This confirmation link is no longer valid.
      </p>
    </div>
  )
}
