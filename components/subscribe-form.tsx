"use client"

import { useState, useRef } from "react"
import { subscribe } from "@/lib/actions"

export function SubscribeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setStatus("loading")
    try {
      const result = await subscribe(formData)
      if (result.status === "already_subscribed") {
        setStatus("success")
        setMessage("You're already subscribed!")
      } else {
        setStatus("success")
        setMessage("Check your email for a confirmation link.")
        formRef.current?.reset()
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Try again.")
    }
  }

  return (
    <div>
      <form ref={formRef} action={handleSubmit} className="flex gap-2 max-w-sm">
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 text-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 shrink-0"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status !== "idle" && (
        <p
          className={`mt-2 text-xs ${
            status === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
