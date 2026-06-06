"use client"

import { useSyncExternalStore } from "react"
import { LuSun, LuMoon } from "react-icons/lu"

function getSnapshot() {
  return document.documentElement.classList.contains("dark")
}

function getServerSnapshot() {
  return false
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle("dark", next)
    document.cookie = `theme=${next ? "dark" : "light"}; path=/; max-age=31536000`
  }

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
      aria-label="Toggle theme"
    >
      {dark ? <LuSun size={16} /> : <LuMoon size={16} />}
    </button>
  )
}
