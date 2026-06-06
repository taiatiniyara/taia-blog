import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl

      if (pathname === "/admin/login") return true

      if (pathname.startsWith("/admin")) {
        if (!auth?.user) return false
        if (auth.user.name !== process.env.ADMIN_GITHUB_USER) {
          return NextResponse.redirect(
            new URL("/admin/login?error=unauthorized", request.nextUrl.origin),
          )
        }
        return true
      }

      return true
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
})
