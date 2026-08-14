import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  deleteAuthCookies,
  REFRESH_COOKIE_NAME,
  revokeAuthSession,
} from "@/services/auth/session";

export async function POST(request: NextRequest) {
  await revokeAuthSession(
    request.cookies.get(ACCESS_COOKIE_NAME)?.value,
    request.cookies.get(REFRESH_COOKIE_NAME)?.value
  );
  const response = NextResponse.json({ ok: true });
  deleteAuthCookies(response);
  return response;
}
