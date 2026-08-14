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
  const response = NextResponse.redirect(new URL(refreshed ? returnTo : "/login", request.url));
  if (refreshed) setAuthCookies(response, refreshed.tokens);
  else deleteAuthCookies(response);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
