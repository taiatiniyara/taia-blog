import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const combined = auth((request) => {
  const response = NextResponse.next()
  response.headers.set("x-pathname", request.nextUrl.pathname)
  return response
})

export { combined as proxy }

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
