import { NextResponse } from "next/server";
import { login, setAuthCookies } from "@/services/auth/session";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email/password" }, { status: 400 });
  }
  const result = await login(parsed.data);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, user: result.user });
  setAuthCookies(response, result.tokens);
  return response;
}
