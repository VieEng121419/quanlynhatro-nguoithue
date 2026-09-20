import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/home", "/invoices", "/services", "/profile"];

function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp <= Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const hasValidToken = Boolean(token && !isTokenExpired(token));
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Chưa đăng nhập mà vào trang bảo vệ → redirect về /login
  if (isProtected && !hasValidToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const response = NextResponse.redirect(url);
    response.cookies.delete("accessToken");
    return response;
  }

  if (pathname === "/login" && hasValidToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|workbox-).*)"],
};