import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { posts } from "../db/schema"

const sqlite = new Database(process.env.DATABASE_URL ?? "data.db")
sqlite.pragma("journal_mode = WAL")
sqlite.pragma("foreign_keys = ON")

const db = drizzle(sqlite)

const now = new Date().toISOString()

const seedPosts = [
  {
    slug: "on-writing-and-thinking",
    title: "On Writing and Thinking",
    tags: "writing,thinking",
    published: 1,
    contentKey: "content/on-writing-and-thinking.json",
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "the-quiet-pleasure-of-early-mornings",
    title: "The Quiet Pleasure of Early Mornings",
    tags: "life,reflection",
    published: 1,
    contentKey: "content/the-quiet-pleasure-of-early-mornings.json",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    slug: "why-we-read-books",
    title: "Why We Read Books",
    tags: "books,thinking",
    published: 1,
    contentKey: "content/why-we-read-books.json",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    slug: "draft-thoughts-on-technology",
    title: "Draft: Thoughts on Technology",
    tags: "technology",
    published: 0,
    contentKey: "content/draft-thoughts-on-technology.json",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    slug: "walking-without-a-destination",
    title: "Walking Without a Destination",
    tags: "life,walking,reflection",
    published: 1,
    contentKey: "content/walking-without-a-destination.json",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
]

db.insert(posts).values(seedPosts).run()

console.log(`Seeded ${seedPosts.length} posts (${seedPosts.filter((p) => p.published).length} published)`)
