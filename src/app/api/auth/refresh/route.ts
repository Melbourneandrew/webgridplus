import { NextRequest, NextResponse } from "next/server";
import {
  deleteAuthCookies,
  REFRESH_COOKIE_NAME,
  refreshAuthSession,
  setAuthCookies,
} from "@/services/auth/session";

function safeReturnPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function GET(request: NextRequest) {
  const returnTo = safeReturnPath(request.nextUrl.searchParams.get("returnTo"));
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  const refreshed = refreshToken ? await refreshAuthSession(refreshToken) : null;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const origin = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL ?? "https://webgridplus.com"
    : `${protocol}://${host}`;
  const response = NextResponse.redirect(new URL(refreshed ? returnTo : "/login", origin));
  if (refreshed) setAuthCookies(response, refreshed.tokens);
  else deleteAuthCookies(response);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
