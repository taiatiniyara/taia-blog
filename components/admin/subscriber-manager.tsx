"use client"

import { useState, useTransition } from "react"
import { addSubscriber, removeSubscriber } from "@/lib/actions"
import { formatDate } from "@/lib/format-date"

type Subscriber = {
  id: number
  email: string
  confirmed: number | null
  createdAt: string
  unsubscribedAt: string | null
}

export function SubscriberManager({ subscribers }: { subscribers: Subscriber[] }) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ text: string; kind: "success" | "error" } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await addSubscriber(formData)
        if (result.status === "already_subscribed") {
          setMessage({ text: `${result.email ?? formData.get("email")} is already subscribed.`, kind: "success" })
        } else {
          setMessage({ text: `${result.email} added.`, kind: "success" })
        }
        setEmail("")
      } catch (err) {
        setMessage({ text: err instanceof Error ? err.message : "Something went wrong", kind: "error" })
      }
    })
  }

  function handleRemove(id: number) {
    const formData = new FormData()
    formData.append("id", String(id))
    startTransition(async () => {
      try {
        await removeSubscriber(formData)
        setMessage({ text: "Subscriber removed.", kind: "success" })
      } catch (err) {
        setMessage({ text: err instanceof Error ? err.message : "Something went wrong", kind: "error" })
      }
    })
  }

  const active = subscribers.filter((s) => s.confirmed && !s.unsubscribedAt)
  const unconfirmed = subscribers.filter((s) => !s.confirmed && !s.unsubscribedAt)
  const unsubscribed = subscribers.filter((s) => s.unsubscribedAt)

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-lg font-semibold mb-4">Subscribers</h2>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-neutral-500">
          {active.length} active
          {unconfirmed.length > 0 && ` · ${unconfirmed.length} unconfirmed`}
          {unsubscribed.length > 0 && ` · ${unsubscribed.length} unsubscribed`}
        </span>
      </div>

      <form action={handleAdd} className="flex items-center gap-2 mb-4">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          aria-label="Subscriber email"
          required
          className="px-3 py-1.5 text-sm border rounded-lg bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 w-64"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-3 py-1.5 text-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
        >
          {isPending ? "Adding..." : "Add Subscriber"}
        </button>
      </form>

      {message && (
        <p
          className={`text-xs mb-4 ${
            message.kind === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      {subscribers.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b text-left text-neutral-500 dark:text-neutral-400">
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium hidden sm:table-cell">Since</th>
                <th className="py-2 pr-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-neutral-100 dark:border-neutral-800">
                  <td className="py-2 pr-4 text-neutral-900 dark:text-neutral-100">{sub.email}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        sub.unsubscribedAt
                          ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                          : sub.confirmed
                            ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                      }`}
                    >
                      {sub.unsubscribedAt ? "Unsubscribed" : sub.confirmed ? "Active" : "Unconfirmed"}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="py-2 pr-4">
                    {!sub.unsubscribedAt && (
                      <button
                        type="button"
                        onClick={() => handleRemove(sub.id)}
                        disabled={isPending}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
