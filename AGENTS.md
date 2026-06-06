<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.

<!-- END:nextjs-agent-rules -->

# taia.blog — Agent Instructions

## Project Overview

Personal blog at `taia.blog`. General-interest writing, not a dev blog.

## Stack

| Layer          | Tech                                                 |
| -------------- | ---------------------------------------------------- |
| Framework      | Next.js 16 (App Router), React 19, TypeScript strict |
| Styling        | Tailwind CSS v4 (no component library)               |
| Database       | SQLite via `better-sqlite3` + Drizzle ORM            |
| Object storage | Cloudflare R2 (S3-compatible)                        |
| Editor         | TipTap (StarterKit + Link + Image + Typography)      |
| Auth           | Auth.js v5 with GitHub OAuth                         |
| Hosting        | Self-hosted VPS (Node.js long-running process)       |

## File Structure

```
app/              App Router routes, layouts, pages
components/       Shared React components (no external UI lib)
lib/              Utilities, R2 client, auth config, TipTap renderer
db/               Drizzle schema, migrations, client singleton
docs/             SPECS.md, ROADMAP.md
public/           Static assets (og-image.png, etc.)
```

## Conventions

- **No comments** unless explicitly requested
- Use `@/*` path alias (maps to project root)
- Server Components by default; `'use client'` only when needed
- **Use Server Actions for all mutations** — no API routes for CRUD. Auth.js
  routes at `/api/auth/[...nextauth]` are the only exception. Image upload and
  content save go through Server Actions, not `fetch()`.
- Use `drizzle-kit generate` + `drizzle-kit migrate` for schema changes (not
  `drizzle-kit push` in production)
- Auth.js API routes at `/api/auth/[...nextauth]`
- Environment variables prefixed as needed, documented in `.env.example`

## Key Architecture Decisions

- **SQLite is the index** — holds metadata only (id, slug, title, tags,
  published, timestamps, contentKey, deletedAt)
- **R2 holds the heavy content** — post body as TipTap JSON
  (`content/{slug}.json`), images (`images/{uuid}.webp`)
- **ISR for post pages** — `generateStaticParams` + revalidation for freshness
  without rebuild
- **Soft deletes** — `deletedAt` column, never hard-delete posts
- **Tags** — comma-separated string column, queried with `LIKE`
- **Single author** — Auth.js GitHub OAuth, gated to one username via
  `ADMIN_GITHUB_USER` env var
- **No comments, no analytics, no search, no tests** (personal blog)
- **Pure Tailwind** — no shadcn/ui, no Headless UI, no component library

## Environment Variables

| Variable               | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `DATABASE_URL`         | Path to SQLite file                       |
| `R2_ENDPOINT`          | Cloudflare R2 endpoint URL                |
| `R2_ACCESS_KEY_ID`     | R2 access key                             |
| `R2_SECRET_ACCESS_KEY` | R2 secret key                             |
| `R2_BUCKET_NAME`       | R2 bucket name                            |
| `R2_PUBLIC_URL`        | Public base URL for R2 objects            |
| `AUTH_SECRET`          | Auth.js secret (`npx auth secret`)        |
| `AUTH_GITHUB_ID`       | GitHub OAuth app client ID                |
| `AUTH_GITHUB_SECRET`   | GitHub OAuth app client secret            |
| `ADMIN_GITHUB_USER`    | GitHub username authorized for `/admin`   |
| `PREVIEW_TOKEN`        | Secret token for draft preview URLs       |
| `SITE_URL`             | `https://taia.blog` (or localhost in dev) |

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npx drizzle-kit generate  # Generate migration from schema changes
npx drizzle-kit migrate   # Apply migrations
```
