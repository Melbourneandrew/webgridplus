import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/services/auth/session";

export async function GET() {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
