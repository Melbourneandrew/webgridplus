import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  deleteAuthCookies,
  REFRESH_COOKIE_NAME,
  revokeAuthSession,
} from "@/services/auth/session";

export async function GET(request: NextRequest) {
  await revokeAuthSession(
    request.cookies.get(ACCESS_COOKIE_NAME)?.value,
    request.cookies.get(REFRESH_COOKIE_NAME)?.value
  );
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const origin = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL ?? "https://webgridplus.com"
    : `${protocol}://${host}`;
  const response = NextResponse.redirect(new URL("/login", origin));
  deleteAuthCookies(response);
  return response;
}
