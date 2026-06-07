import Link from "next/link"
import { LuLayers, LuUser, LuTerminal, LuLogOut } from "react-icons/lu"
import { ThemeToggle } from "./theme-toggle"
import { auth, signOut } from "@/lib/auth"

export async function Header() {
  const session = await auth()
  const isAdmin = session?.user?.name?.toLowerCase() === process.env.ADMIN_GITHUB_USER?.toLowerCase()

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <nav className="mx-auto max-w-5xl px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-semibold tracking-tight">
          Taia&apos;s Blog
        </Link>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <Link href="/series" className="hover:text-neutral-600 dark:hover:text-neutral-400 inline-flex items-center gap-1">
            <LuLayers size={14} />
            Series
          </Link>
          <Link href="/about" className="hover:text-neutral-600 dark:hover:text-neutral-400 inline-flex items-center gap-1">
            <LuUser size={14} />
            About
          </Link>
          {isAdmin && (
            <>
              <Link href="/admin" className="hover:text-neutral-600 dark:hover:text-neutral-400 inline-flex items-center gap-1">
                <LuTerminal size={14} />
                Admin
              </Link>
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <button
                  type="submit"
                  className="hover:text-neutral-600 dark:hover:text-neutral-400 inline-flex items-center gap-1 cursor-pointer"
                >
                  <LuLogOut size={14} />
                  Logout
                </button>
              </form>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
