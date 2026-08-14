import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  // GET is intentionally non-mutating so link prefetchers and crawlers cannot
  // revoke sessions. Actual logout is POST /api/auth/logout.
  return response;
}
