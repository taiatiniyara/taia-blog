"use client"

import { useState } from "react"
import { LuSun, LuMoon } from "react-icons/lu"

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false
    return document.documentElement.classList.contains("dark")
  })

  function toggle() {
    const next = !dark
    setDark(next)
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
