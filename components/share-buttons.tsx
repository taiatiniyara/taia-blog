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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547.8-3.747c2.061.236 3.723.86 5.044 1.698a1.25 1.25 0 0 1 .619 1.041 1.249 1.249 0 0 1-2.618.25zm3.402 7.83c0 .372-.016.806-.098 1.308-.082.503-.257 1.07-.574 1.637-.48.86-1.29 1.638-2.44 2.155-1.152.517-2.58.792-4.218.826h-.163c-1.638-.034-3.065-.309-4.217-.826-1.15-.517-1.96-1.296-2.44-2.155-.317-.568-.492-1.134-.574-1.637-.083-.502-.098-.936-.098-1.308 0-.372.015-.807.098-1.309.082-.503.257-1.07.574-1.637.48-.86 1.289-1.639 2.44-2.156 1.152-.517 2.579-.792 4.217-.826h.163c1.638.034 3.066.309 4.218.826 1.15.517 1.96 1.296 2.44 2.156.317.568.492 1.134.574 1.637.083.502.098.937.098 1.309zm-8.662-.415a1.25 1.249 0 1 0 0 2.498 1.25 1.249 0 0 0 0-2.498zm5.23 1.25a1.25 1.249 0 0 0-2.498 0 1.25 1.249 0 0 0 2.498 0zm-3.517 3.079c.45.219.966.34 1.537.34.57 0 1.087-.121 1.537-.34.155-.076.334.019.338.189l.004.064c0 .355-.787.996-1.88.996-1.092 0-1.879-.64-1.879-.996 0-.145.088-.239.216-.229.053.004.094.002.127-.024z" />
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
    <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-1">
      <span className="text-xs text-neutral-400 dark:text-neutral-500 mr-2">Share</span>
      <a
        href={`https://x.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs transition-colors duration-150"
        aria-label="Share on X"
      >
        <XIcon className="w-3.5 h-3.5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs transition-colors duration-150"
        aria-label="Share on Facebook"
      >
        <FacebookIcon className="w-3.5 h-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs transition-colors duration-150"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon className="w-3.5 h-3.5" />
      </a>
      <a
        href={`https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs transition-colors duration-150"
        aria-label="Share on Reddit"
      >
        <RedditIcon className="w-3.5 h-3.5" />
      </a>
      <a
        href={`mailto:?subject=${shareTitle}&body=${shareUrl}`}
        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs transition-colors duration-150"
        aria-label="Share via email"
      >
        <LuMail size={14} />
      </a>
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs transition-colors duration-150"
        aria-label="Copy link"
      >
        {copied ? <LuCheck size={14} /> : <LuLink2 size={14} />}
      </button>
    </div>
  )
}
