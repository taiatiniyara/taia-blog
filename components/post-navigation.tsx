import Link from "next/link"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

type AdjacentPost = { slug: string; title: string } | null

function TruncatedTitle({ title }: { title: string }) {
  return (
    <>
      <span className="hidden sm:inline">{title}</span>
      <span className="sm:hidden">
        {title.length > 30 ? title.slice(0, 27) + "..." : title}
      </span>
    </>
  )
}

export function PostNavigation({
  previous,
  next,
}: {
  previous: AdjacentPost
  next: AdjacentPost
}) {
  if (!previous && !next) return null

  return (
    <nav className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-3 sm:gap-4">
      <div>
        {previous && (
          <Link
            href={`/blog/${previous.slug}`}
            className="group text-xs sm:text-sm"
          >
            <span className="text-neutral-400 dark:text-neutral-500 inline-flex items-center gap-1"><LuChevronLeft size={14} /> Older</span>
            <span className="block text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 leading-snug">
              <TruncatedTitle title={previous.title} />
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link
            href={`/blog/${next.slug}`}
            className="group text-xs sm:text-sm"
          >
            <span className="text-neutral-400 dark:text-neutral-500 inline-flex items-center gap-1">Newer <LuChevronRight size={14} /></span>
            <span className="block text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 leading-snug">
              <TruncatedTitle title={next.title} />
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
