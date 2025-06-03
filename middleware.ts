import { type NextRequest, NextResponse } from "next/server"

export default function middleware(req: NextRequest) {
  const authToken = req.cookies.get("auth_token")?.value
  const userRole = req.cookies.get("auth_role")?.value
  const path = req.nextUrl.pathname

  // Check if the path is an admin route
  if (path.startsWith("/admin")) {
    // If no auth token or not an admin, redirect to login
    if (!authToken || userRole !== "ADMIN") {
      const url = new URL("/auth/login", req.url)
      url.searchParams.set("callbackUrl", encodeURI(req.url))
      url.searchParams.set("error", "Unauthorized access. Admin privileges required.")
      return NextResponse.redirect(url)
    }
  }

  // Check if the path is a protected user route
  if (path.startsWith("/dashboard")) {
    // If no auth token, redirect to login
    if (!authToken) {
      const url = new URL("/auth/login", req.url)
      url.searchParams.set("callbackUrl", encodeURI(req.url))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
