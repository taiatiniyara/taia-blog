import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Typography from "@tiptap/extension-typography"

export function renderTiptapJSON(json: Record<string, unknown>): string {
  return generateHTML(json, [
    StarterKit,
    Link.configure({
      openOnClick: true,
      HTMLAttributes: {
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
    Image,
    Typography,
  ])
}
