import { NextResponse } from "next/server"

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/", "/login", "/register", "/verify-otp", "/forgot-pin"]
  if (publicRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  // Check auth from cookie (we'll use a simple approach)
  // In production this would verify a JWT
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}