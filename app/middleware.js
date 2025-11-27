import { NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request) {
  const pathname = request.nextUrl.pathname

  // Public routes
  if (pathname.startsWith("/(auth)") || pathname === "/") {
    return NextResponse.next()
  }

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/editor")) {
    const token = request.cookies.get("cms_token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
