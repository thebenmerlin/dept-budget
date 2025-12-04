import { withAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const request = req as unknown as NextRequest;
    const path = request.nextUrl.pathname

    if (path.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (path.startsWith("/expenses/approve") && token?.role === "STAFF") {
      return NextResponse.redirect(new URL("/expenses", request.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/budget/:path*",
    "/reports/:path*",
    "/api/budget/:path*",
    "/api/expenses/:path*",
    "/api/reports/:path*",
  ]
}