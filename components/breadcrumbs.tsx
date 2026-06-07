"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LuChevronRight } from "react-icons/lu"

const HOME = { label: "Home", href: "/" }

export function Breadcrumbs() {
  const pathname = usePathname()

  if (pathname === "/") return null
  if (pathname.startsWith("/admin")) return null

  const segments = pathname.split("/").filter(Boolean)
  const crumbs = [HOME]

  let href = ""
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (seg === "blog") {
      href += "/blog"
      crumbs.push({ label: "Blog", href })
    } else if (seg === "tags") {
      href += "/tags"
      crumbs.push({ label: "Tags", href })
      if (segments[i + 1]) {
        href += `/${segments[i + 1]}`
        crumbs.push({ label: decodeURIComponent(segments[i + 1]), href })
        break
      }
    } else if (seg === "series") {
      href += "/series"
      crumbs.push({ label: "Series", href })
      if (segments[i + 1] && segments[i + 1] !== "list") {
        href += `/${segments[i + 1]}`
        crumbs.push({ label: decodeURIComponent(segments[i + 1]), href })
        break
      }
    } else if (seg === "about") {
      href += "/about"
      crumbs.push({ label: "About", href })
    } else if (seg === "page") {
      href += "/page"
      crumbs.push({ label: "Page", href })
      if (segments[i + 1]) {
        href += `/${segments[i + 1]}`
        crumbs.push({ label: segments[i + 1], href })
        break
      }
    }
  }

  if (crumbs.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-6 mx-auto max-w-5xl">
      <ol className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="text-neutral-900 dark:text-neutral-100">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  {crumb.label}
                </Link>
              )}
              {!isLast && <LuChevronRight size={12} />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
