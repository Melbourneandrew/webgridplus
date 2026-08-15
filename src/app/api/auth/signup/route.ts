import { NextResponse } from "next/server";
import { setAuthCookies, signup } from "@/services/auth/session";
import { z } from "zod";
import { DISPLAY_NAME_MAX_LENGTH } from "@/domain/user/display-name";

const signupSchema = z.object({
  displayName: z.string().trim().min(2).max(DISPLAY_NAME_MAX_LENGTH),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid name, email, and password." }, { status: 400 });
  }
  const result = await signup(parsed.data);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, user: result.user });
  setAuthCookies(response, result.tokens);
  return response;
}
