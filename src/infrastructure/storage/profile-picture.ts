import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export function sanitizeProfilePictureFileName(fileName: string): string {
  const baseName = path.basename(fileName).normalize("NFKC");
  const sanitized = baseName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^-+/, "");
  return sanitized || "upload";
}

export async function saveProfilePicture(fileName: string, data: Buffer): Promise<string> {
  const safeFileName = sanitizeProfilePictureFileName(fileName);
  const normalized = path.posix.join("profile-pictures", `${randomUUID()}-${safeFileName}`);
  const outputPath = path.join(process.cwd(), "public", normalized);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, data);
  return `/${normalized}`;
}
