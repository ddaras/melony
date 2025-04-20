import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Set pathname in request headers for server components to access
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Match all paths except for static files, api routes, etc.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
