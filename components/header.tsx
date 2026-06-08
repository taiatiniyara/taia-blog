import Link from "next/link"
import { LuLayers, LuUser, LuTerminal, LuLogOut } from "react-icons/lu"
import { ThemeToggle } from "./theme-toggle"
import { auth, signOut } from "@/lib/auth"

function activeClass(isActive: boolean) {
  return isActive
    ? "text-neutral-900 dark:text-neutral-100"
    : "hover:text-neutral-600 dark:hover:text-neutral-400"
}

export async function Header({ pathname }: { pathname: string }) {
  const session = await auth()
  const isAdmin = session?.user?.name?.toLowerCase() === process.env.ADMIN_GITHUB_USER?.toLowerCase()

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <nav className="mx-auto max-w-5xl px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-semibold tracking-tight transition-colors duration-150">
          Taia&apos;s Blog
        </Link>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <Link
            href="/series"
            className={`inline-flex items-center gap-1 transition-colors duration-150 ${activeClass(pathname.startsWith("/series"))}`}
          >
            <LuLayers size={14} />
            Series
          </Link>
          <Link
            href="/about"
            className={`inline-flex items-center gap-1 transition-colors duration-150 ${activeClass(pathname === "/about")}`}
          >
            <LuUser size={14} />
            About
          </Link>
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className={`inline-flex items-center gap-1 transition-colors duration-150 ${activeClass(pathname.startsWith("/admin"))}`}
              >
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
                  className="hover:text-neutral-600 dark:hover:text-neutral-400 inline-flex items-center gap-1 cursor-pointer transition-colors duration-150"
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
