import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";

  // Fast path: no session token and trying to access protected routes
  if (!sessionToken && (isDashboardRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Fast path: session token exists and accessing login — redirect to appropriate page
  if (isLoginRoute && sessionToken) {
    try {
      const sessionResponse = await fetch(
        new URL("/api/auth/get-session", request.url).toString(),
        {
          headers: { cookie: request.headers.get("cookie") || "" },
        }
      );
      if (sessionResponse.ok) {
        const session = await sessionResponse.json();
        if (session?.user) {
          const redirectUrl = session.user.role === "admin" ? "/admin" : "/dashboard";
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
      }
    } catch {
      // Fail silently and proceed to /login
    }
  }

  // Admin route role verification
  if (isAdminRoute && sessionToken) {
    try {
      const sessionResponse = await fetch(
        new URL("/api/auth/get-session", request.url).toString(),
        {
          headers: { cookie: request.headers.get("cookie") || "" },
        }
      );

      if (!sessionResponse.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const session = await sessionResponse.json();

      if (!session?.user || session.user.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      console.error("Proxy admin check error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
export default proxy;
