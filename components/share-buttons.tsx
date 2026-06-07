"use client"

import { LuLink2, LuMail, LuCheck } from "react-icons/lu"
import { useState } from "react"

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

type Props = {
  url: string
  title: string
}

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = encodeURIComponent(url)
  const shareTitle = encodeURIComponent(title)

  return (
    <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-1">
      <span className="text-xs text-neutral-400 dark:text-neutral-500 mr-2">Share</span>
      <a
        href={`https://x.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs"
        aria-label="Share on X"
      >
        <XIcon className="w-3.5 h-3.5" />
      </a>
      <a
        href={`mailto:?subject=${shareTitle}&body=${shareUrl}`}
        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs"
        aria-label="Share via email"
      >
        <LuMail size={14} />
      </a>
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs"
        aria-label="Copy link"
      >
        {copied ? <LuCheck size={14} /> : <LuLink2 size={14} />}
      </button>
    </div>
  )
}
