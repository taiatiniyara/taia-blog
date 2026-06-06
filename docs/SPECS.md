# SPECS — taia.blog

## Identity

- **Site title**: "taia.blog"
- **Domain**: `taia.blog`
- **Purpose**: Personal blog for general-interest writing (essays, opinions,
  reflections)

---

## Stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| Framework        | Next.js 16 (App Router)                         |
| Language         | TypeScript (strict mode)                        |
| UI               | React 19, Tailwind CSS v4                       |
| Database         | SQLite via `better-sqlite3` + Drizzle ORM       |
| Object storage   | Cloudflare R2                                   |
| Rich text editor | TipTap (StarterKit + Link + Image + Typography) |
| Authentication   | Auth.js v5, GitHub OAuth provider               |
| Hosting          | Self-hosted VPS (Node.js long-running process)  |

---

## Data Model

### SQLite — `posts` table

| Column       | Type                          | Notes                                     |
| ------------ | ----------------------------- | ----------------------------------------- |
| `id`         | `integer` (PK, autoincrement) |                                           |
| `slug`       | `text` (unique, not null)     | Auto-generated from title, editable       |
| `title`      | `text` (not null)             |                                           |
| `tags`       | `text`                        | Comma-separated, e.g. `"philosophy,life"` |
| `published`  | `integer` (boolean)           | `0` = draft, `1` = published              |
| `contentKey` | `text`                        | R2 object key: `content/{slug}.json`      |
| `createdAt`  | `text` (ISO 8601)             | Set on creation                           |
| `updatedAt`  | `text` (ISO 8601)             | Updated on every save                     |
| `deletedAt`  | `text` (ISO 8601, nullable)   | Soft delete timestamp                     |

### R2 object structure

```
content/{slug}.json    # TipTap JSON document
images/{uuid}.webp     # Uploaded images (client-resized, max 1200px)
```

---

## Routes

| Route                        | Method | Description                                 |
| ---------------------------- | ------ | ------------------------------------------- |
| `/`                          | GET    | Homepage — 10 most recent published posts   |
| `/page/[n]`                  | GET    | Paginated post list                         |
| `/blog/[slug]`               | GET    | Single post (ISR, revalidate)               |
| `/blog/[slug]?preview=token` | GET    | Draft preview (checks `PREVIEW_TOKEN`)      |
| `/tags/[tag]`                | GET    | Posts filtered by tag                       |
| `/about`                     | GET    | Static about page                           |
| `/feed.xml`                  | GET    | RSS feed                                    |
| `/sitemap.xml`               | GET    | Dynamic sitemap                             |
| `/admin`                     | GET    | Dashboard — post list table (auth required) |
| `/admin/login`               | GET    | Login page ("Sign in with GitHub")          |
| `/api/auth/[...nextauth]`    | \*     | Auth.js handler                             |
| `/api/upload`                | POST   | Image upload → R2 (auth required)           |
| `not-found.tsx`              | —      | Custom 404 page                             |
| `error.tsx`                  | —      | Custom error page                           |

---

## Rendering Strategy

| Page           | Strategy | Details                                                 |
| -------------- | -------- | ------------------------------------------------------- |
| Homepage       | ISR      | Revalidate periodically                                 |
| `/blog/[slug]` | ISR      | `generateStaticParams` from published slugs, revalidate |
| `/tags/[tag]`  | ISR      | `generateStaticParams` from distinct tags               |
| `/about`       | Static   | Pure static page                                        |
| `/feed.xml`    | Dynamic  | Route handler, queries published posts                  |
| `/sitemap.xml` | Dynamic  | Route handler, queries published posts                  |
| `/admin/**`    | Dynamic  | Server-rendered, auth-gated                             |

---

## Content Pipeline

```
[TipTap Editor] → JSON → R2 (auto-save every 30s + manual save)
                              ↓
[Server Component] ← R2 JSON ← [@tiptap/html generateHTML()] → [HTML to reader]
```

1. Author writes in TipTap inside `/admin`
2. Auto-save posts JSON body to R2 every 30 seconds
3. Manual "Save" button also triggers save + updates SQLite metadata
4. `published` toggle controls visibility
5. Reader hits `/blog/[slug]` → server fetches JSON from R2 → `generateHTML()` →
   rendered page

---

## Admin Features

- Post list table (all posts, sorted by `updatedAt` desc)
- "New Post" button → single-page editor
- Title input, slug input (auto-generated, editable), tags input
- TipTap editor (full-width with image upload support)
- Published/draft toggle
- Auto-save (30s interval) + manual save button
- Click existing post row to edit (loads JSON from R2)
- Soft delete button

---

## Auth Flow

1. User visits `/admin` → middleware checks session
2. No session → redirect to `/admin/login`
3. `/admin/login` shows "Sign in with GitHub" button
4. GitHub OAuth → Auth.js callback → session created
5. Middleware checks `session.user.name === ADMIN_GITHUB_USER`
6. Not authorized → redirect away with error
7. Authorized → `/admin` dashboard renders

---

## Design

| Aspect      | Value                                       |
| ----------- | ------------------------------------------- |
| Body font   | Source Serif 4 (Google Fonts)               |
| UI font     | Geist Sans (already configured)             |
| Color mode  | System default + manual toggle (dark/light) |
| Header      | "taia.blog" (left) + "About" (right)        |
| Footer      | © {year} taia.blog · RSS                    |
| OG image    | Static fallback (`public/og-image.png`)     |
| Error pages | Custom 404 + error boundary                 |

### Homepage Post Cards

Each card shows:

- Title (linked to post)
- Publication date
- Tags (linked to tag pages)
- Auto-generated excerpt (first ~200 chars, stripped from JSON)
- Reading time ("X min read")

---

## Exclusions

| Feature              | Reason                                |
| -------------------- | ------------------------------------- |
| Comments             | Keeps it simple, no moderation burden |
| Analytics            | Writing for self, not metrics         |
| Search               | Homepage + tags sufficient for volume |
| Social share buttons | Readers know how to copy URL          |
| Multiple authors     | Single-author blog                    |
| Tests                | Personal blog, ship fast              |
| Component library    | Pure Tailwind, full control           |

---

## Environment Variables

| Variable               | Purpose                        |
| ---------------------- | ------------------------------ |
| `DATABASE_URL`         | Path to SQLite file            |
| `R2_ENDPOINT`          | Cloudflare R2 endpoint         |
| `R2_ACCESS_KEY_ID`     | R2 access key                  |
| `R2_SECRET_ACCESS_KEY` | R2 secret key                  |
| `R2_BUCKET_NAME`       | R2 bucket name                 |
| `R2_PUBLIC_URL`        | Public base URL for R2 objects |
| `AUTH_SECRET`          | Auth.js secret                 |
| `AUTH_GITHUB_ID`       | GitHub OAuth client ID         |
| `AUTH_GITHUB_SECRET`   | GitHub OAuth client secret     |
| `ADMIN_GITHUB_USER`    | Authorized GitHub username     |
| `PREVIEW_TOKEN`        | Secret token for draft preview |
| `SITE_URL`             | `https://taia.blog`            |
