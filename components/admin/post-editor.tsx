"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExtension from "@tiptap/extension-link"
import ImageExtension from "@tiptap/extension-image"
import Typography from "@tiptap/extension-typography"
import { useCallback, useEffect, useRef, useState } from "react"
import { uploadImage } from "@/lib/actions"
import imageCompression from "browser-image-compression"

type PostEditorProps = {
  initialContent?: Record<string, unknown>
  onChange: (json: Record<string, unknown>) => void
}

async function compressAndUpload(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: "image/webp",
  })

  const formData = new FormData()
  formData.set("file", compressed)
  return await uploadImage(formData)
}

export function PostEditor({ initialContent, onChange }: PostEditorProps) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      ImageExtension,
      Typography,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
      handleDrop: (view, event, _slice, _moved) => {
        const files = event.dataTransfer?.files
        if (files && files.length > 0) {
          const imageFiles = Array.from(files).filter((f) =>
            f.type.startsWith("image/"),
          )
          if (imageFiles.length > 0) {
            event.preventDefault()
            setUploading(true)
            Promise.all(imageFiles.map(compressAndUpload))
              .then((urls) => {
                urls.forEach((url) => {
                  view.dispatch(
                    view.state.tr.replaceSelectionWith(
                      view.state.schema.nodes.image.create({ src: url }),
                    ),
                  )
                })
              })
              .catch(console.error)
              .finally(() => setUploading(false))
            return true
          }
        }
        return false
      },
      handlePaste: (view, event, _slice) => {
        const items = event.clipboardData?.items
        if (!items) return false

        const imageItems: DataTransferItem[] = []
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith("image/")) {
            imageItems.push(items[i])
          }
        }

        if (imageItems.length > 0) {
          event.preventDefault()
          setUploading(true)
          const files = imageItems.map((item) => item.getAsFile()).filter(Boolean) as File[]
          Promise.all(files.map(compressAndUpload))
            .then((urls) => {
              urls.forEach((url) => {
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({ src: url }),
                  ),
                )
              })
            })
            .catch(console.error)
            .finally(() => setUploading(false))
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current(editor.getJSON() as Record<string, unknown>)
    },
  })

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  const toggleHeading = useCallback(
    (level: 1 | 2 | 3) => {
      if (!editor) return
      editor.chain().focus().toggleHeading({ level }).run()
    },
    [editor],
  )

  if (!editor) {
    return <div className="min-h-[300px] border rounded-lg bg-neutral-50 dark:bg-neutral-900 animate-pulse" />
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-neutral-50 dark:bg-neutral-900">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          label="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>
        <span className="w-px h-5 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <ToolbarButton
          onClick={() => toggleHeading(1)}
          active={editor.isActive("heading", { level: 1 })}
          label="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => toggleHeading(2)}
          active={editor.isActive("heading", { level: 2 })}
          label="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => toggleHeading(3)}
          active={editor.isActive("heading", { level: 3 })}
          label="Heading 3"
        >
          H3
        </ToolbarButton>
        <span className="w-px h-5 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Bullet list"
        >
          &bull;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Ordered list"
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="Blockquote"
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          label="Code block"
        >
          &lt;/&gt;
        </ToolbarButton>
        <span className="w-px h-5 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false}
          label="Horizontal rule"
        >
          &mdash;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Link URL")
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          active={editor.isActive("link")}
          label="Link"
        >
          Link
        </ToolbarButton>
        {uploading && (
          <span className="ml-2 text-xs text-neutral-400">Uploading...</span>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void
  active: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
        active ? "bg-neutral-200 dark:bg-neutral-700 font-semibold" : ""
      }`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}
