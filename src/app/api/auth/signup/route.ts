import { NextResponse } from "next/server";
import { signup } from "@/services/auth/session";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await signup({
    displayName: body.displayName,
    email: body.email,
    password: body.password,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, user: result.user });
}
