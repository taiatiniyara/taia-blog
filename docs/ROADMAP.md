# ROADMAP — taia.blog

## Phase 1: Foundation (database + schema)

- [ ] Install dependencies: `better-sqlite3`, `drizzle-orm`, `drizzle-kit`,
      `@types/better-sqlite3`
- [ ] Create `db/schema.ts` — `posts` table with Drizzle
- [ ] Create `db/client.ts` — singleton DB connection
- [ ] `drizzle.config.ts` configuration
- [ ] Run `drizzle-kit generate` → first migration
- [ ] `.env.example` with all documented variables
- [ ] Update `tsconfig.json` if needed for path aliases

## Phase 2: Core pages (public read path)

- [ ] Replace `app/page.tsx` — homepage post list (SSR → ISR after DB wired)
- [ ] Create `app/blog/[slug]/page.tsx` — single post page
- [ ] Create `app/page/[n]/page.tsx` — paginated post list
- [ ] Create `app/about/page.tsx` — static about page
- [ ] Create `app/tags/[tag]/page.tsx` — posts by tag
- [ ] Create `app/not-found.tsx` — custom 404
- [ ] Create `app/error.tsx` — custom error boundary
- [ ] Create post card component, post list component, excerpt utility
- [ ] Reading time utility
- [ ] Previous/next navigation on post pages
- [ ] Header component ("taia.blog" + About link)
- [ ] Footer component (copyright + RSS link)
- [ ] Dark/light mode toggle
- [ ] Source Serif 4 font integration via `next/font/google`
- [ ] OG metadata generation per post page

## Phase 3: Content rendering (TipTap JSON → HTML)

- [ ] Install `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-link`,
      `@tiptap/extension-image`, `@tiptap/extension-typography`
- [ ] Install `@tiptap/html` for server-side `generateHTML()`
- [ ] Create `lib/tiptap-renderer.ts` — server-side render utility
- [ ] Wire renderer into post page

## Phase 4: Authentication

- [ ] Install `next-auth` (Auth.js v5) and `@auth/core`
- [ ] Configure Auth.js with GitHub provider
- [ ] Create `/api/auth/[...nextauth]/route.ts`
- [ ] Create `/admin/login/page.tsx` — login page
- [ ] Auth middleware (protect `/admin`, check `ADMIN_GITHUB_USER`)
- [ ] Set env vars: `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`,
      `ADMIN_GITHUB_USER`

## Phase 5: Admin dashboard

- [ ] Install TipTap React packages (`@tiptap/react`, `@tiptap/pm`)
- [ ] Create `/admin/page.tsx` — post list table
- [ ] Create `components/admin/post-editor.tsx` — TipTap editor component
- [ ] Create admin layout (sidebar or minimal chrome)
- [ ] Auto-save logic (30s interval → R2 upload)
- [ ] Manual save button (metadata → SQLite, content → R2)
- [ ] Slug auto-generation from title
- [ ] Draft/publish toggle
- [ ] Soft delete button
- [ ] Click row to edit existing post

## Phase 6: R2 integration

- [ ] Install `@aws-sdk/client-s3` and `@aws-sdk/lib-storage`
- [ ] Create `lib/r2-client.ts` — S3 client configured for R2
- [ ] Create `/api/upload/route.ts` — image upload handler (auth-gated)
- [ ] Client-side image resize before upload (`browser-image-compression`)
- [ ] TipTap image extension wired to `/api/upload`
- [ ] Content save/load to/from R2

## Phase 7: Syndication

- [ ] Create `app/feed.xml/route.ts` — RSS route handler
- [ ] Create `app/sitemap.xml/route.ts` — dynamic sitemap route handler

## Phase 8: Polish

- [ ] Draft preview (`?preview=token` on post page)
- [ ] OG image fallback (`public/og-image.png`)
- [ ] Theme toggle component (persisted in localStorage or cookie)
- [ ] Final metadata pass (layout.tsx title, description, OG defaults)
- [ ] Custom 404 page content
- [ ] Error page styling

## Phase 9: Deployment prep

- [ ] `next.config.ts` — production configuration (images, headers, etc.)
- [ ] PM2 ecosystem config (`ecosystem.config.cjs`)
- [ ] Cron job for daily SQLite → R2 backup (`scripts/backup.ts`)
- [ ] UptimeRobot monitoring

---

## Dependency Graph

```
Phase 1  (DB schema)
   ↓
Phase 2  (Public pages) ← depends on Phase 1 for data
   ↓
Phase 3  (Content rendering) ← depends on Phase 2 for post pages
   ↓
Phase 4  (Auth) ← independent of Phase 3
   ↓
Phase 5  (Admin) ← depends on Phase 4 (auth) + Phase 3 (editor deps)
   ↓
Phase 6  (R2) ← depends on Phase 4 (auth for upload) + Phase 5 (editor image extension)
   ↓
Phase 7  (RSS/Sitemap) ← depends on Phase 1 (DB queries)
   ↓
Phase 8  (Polish) ← depends on all above
   ↓
Phase 9  (Deploy) ← depends on all above
```
