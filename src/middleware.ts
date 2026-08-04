import { NextResponse } from "next/server";

export function middleware() {
  // Auth guard - temporarily allow all access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|workbox-).*)"],
};