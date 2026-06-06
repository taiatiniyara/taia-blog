import { unsubscribe } from "@/lib/actions"

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Missing token</h1>
        <p className="text-neutral-500">No unsubscribe token provided.</p>
      </div>
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
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Unsubscribed</h1>
        <p className="text-neutral-500">
          You&apos;ve been unsubscribed. You can re-subscribe anytime on the blog.
        </p>
      </div>
    )
  }

  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Invalid or expired token</h1>
      <p className="text-neutral-500">
        This unsubscribe link is no longer valid.
      </p>
    </div>
  )
}
