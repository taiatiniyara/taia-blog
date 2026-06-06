import { formatDate } from "./format-date"

const baseUrl = process.env.SITE_URL ?? "http://localhost:3000"
const accent = "#171717"
const muted = "#6b7280"
const bg = "#fafafa"

export function postEmailTemplate({
  title,
  slug,
  excerpt,
  date,
  unsubscribeUrl,
}: {
  title: string
  slug: string
  excerpt: string
  date: string
  unsubscribeUrl: string
}): string {
  const url = `${baseUrl}/blog/${slug}`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:${bg};font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${bg};padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:0 16px;">
              <p style="font-size:13px;color:${muted};margin:0 0 8px;">
                <strong style="color:${accent};">Taia's Blog</strong>
              </p>
              <h1 style="font-size:28px;line-height:1.3;color:${accent};margin:0 0 12px;">
                <a href="${url}" style="color:${accent};text-decoration:none;">${title}</a>
              </h1>
              <p style="font-size:14px;color:${muted};margin:0 0 24px;">${formatDate(date)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:24px;">
                    <p style="font-size:16px;line-height:1.7;color:#374151;margin:0;">
                      ${excerpt}
                      ${excerpt.endsWith(".") || excerpt.endsWith("!") || excerpt.endsWith("?") ? "" : "..."}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 16px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:${accent};border-radius:6px;">
                    <a href="${url}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:15px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">
                      Read the full post &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 16px 0;">
              <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 12px;">
                You can also <strong>reply to this email</strong> with your thoughts &mdash; I read every reply.
              </p>
              <p style="font-size:12px;color:${muted};margin:0;">
                You received this because you subscribed to Taia's Blog.
                <br>
                <a href="${unsubscribeUrl}" style="color:${muted};">Unsubscribe</a> &middot;
                <a href="${baseUrl}" style="color:${muted};">taia.blog</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
