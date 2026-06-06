import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tags: text("tags").default(""),
  series: text("series"),
  published: integer("published").default(0),
  contentKey: text("content_key"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  deletedAt: text("deleted_at"),
})
