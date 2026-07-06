import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  const isDashboardRoute = url.pathname.startsWith("/dashboard");
  const isAdminRoute = url.pathname.startsWith("/admin");

  if (isDashboardRoute || isAdminRoute) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdminRoute) {
      try {
        const sessionResponse = await fetch(
          new URL("/api/auth/get-session", request.url).toString(),
          {
            headers: {
              cookie: request.headers.get("cookie") || "",
            },
          }
        );

        if (!sessionResponse.ok) {
          return NextResponse.redirect(new URL("/login", request.url));
        }

        const session = await sessionResponse.json();

        if (!session || !session.user || session.user.role !== "admin") {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      } catch (error) {
        console.error("Proxy admin check error:", error);
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  // Redirect users who are already logged in away from /login
  if (url.pathname === "/login" && sessionToken) {
    try {
      const sessionResponse = await fetch(
        new URL("/api/auth/get-session", request.url).toString(),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );
      if (sessionResponse.ok) {
        const session = await sessionResponse.json();
        if (session && session.user) {
          if (session.user.role === "admin") {
            return NextResponse.redirect(new URL("/admin", request.url));
          } else {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        }
      }
    } catch (e) {
      // Fail silently and proceed to /login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
export default proxy;
