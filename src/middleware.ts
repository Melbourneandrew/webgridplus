import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = "wgp_access";
const REFRESH_COOKIE_NAME = "wgp_refresh";

export function middleware(request: NextRequest) {
  if (
    !request.cookies.has(ACCESS_COOKIE_NAME) &&
    request.cookies.has(REFRESH_COOKIE_NAME)
  ) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
    const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
    const origin = process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_URL ?? "https://webgridplus.com"
      : `${protocol}://${host}`;
    const refreshUrl = new URL("/api/auth/refresh", origin);
    refreshUrl.searchParams.set("returnTo", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(refreshUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|wgp-favicon.png|login|signup|auth/logout).*)"],
};
