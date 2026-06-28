import { NextResponse } from "next/server";
import { getCurrentUser } from "@/services/auth/session";
import { saveProfilePicture } from "@/infrastructure/storage/profile-picture";
import { upsertProfilePicture } from "@/infrastructure/db/repositories/user-repository";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const saved = await saveProfilePicture(file.name, bytes);
  await upsertProfilePicture(user.id, saved);

  return NextResponse.json({ pictureUrl: saved });
}
