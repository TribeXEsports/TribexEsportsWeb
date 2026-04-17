import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    const role = token?.userRole;

    // 1. Initial Login/Dashboard Redirection
    if (pathname === "/dashboard") {
      if (role === "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
      if (role === "ORGANIZER") return NextResponse.redirect(new URL("/organizer/dashboard", req.url));
      if (role === "CAPTAIN" || role === "PLAYER") return NextResponse.redirect(new URL("/team/dashboard", req.url));
    }

    // 2. Protect Admin strictly for SUPER_ADMIN
    if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 3. Protect Organizer for ORGANIZER or SUPER_ADMIN
    if (pathname.startsWith("/organizer") && role !== "ORGANIZER" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 4. Protect Team dashboard for registered roles
    if (pathname.startsWith("/team") && !["CAPTAIN", "PLAYER", "SUPER_ADMIN", "ORGANIZER"].includes(role as string)) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/organizer/:path*",
    "/team/:path*",
    "/dashboard/:path*",
  ],
};
