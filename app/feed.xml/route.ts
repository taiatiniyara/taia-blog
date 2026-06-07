import { db } from "@/db/client"
import { posts } from "@/db/schema"
import { and, eq, isNull, desc } from "drizzle-orm"
import { getSiteUrl } from "@/lib/utils"

export async function GET() {
  const publishedPosts = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(and(eq(posts.published, 1), isNull(posts.deletedAt)))
    .orderBy(desc(posts.createdAt))
    .limit(20)
    .all()

  const siteUrl = getSiteUrl()

  const items = publishedPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>taia.blog</title>
    <link>${siteUrl}</link>
    <description>Personal thoughts on things in general.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
