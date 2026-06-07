import Link from "next/link"
import { LuArrowLeft } from "react-icons/lu"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-end mb-6">
        <Link
          href="/"
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1"
        >
          <LuArrowLeft size={14} />
          Back to site
        </Link>
      </div>
      {children}
    </div>
  )
}
