import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = "wgp_access";
const REFRESH_COOKIE_NAME = "wgp_refresh";

export function middleware(request: NextRequest) {
  if (
    !request.cookies.has(ACCESS_COOKIE_NAME) &&
    request.cookies.has(REFRESH_COOKIE_NAME)
  ) {
    const refreshUrl = request.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh";
    refreshUrl.search = "";
    refreshUrl.searchParams.set("returnTo", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(refreshUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|wgp-favicon.png|login|signup|auth/logout).*)"],
};
