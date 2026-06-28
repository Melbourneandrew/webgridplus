import fs from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";

export async function saveProfilePicture(fileName: string, data: Buffer): Promise<string> {
  const normalized = path.posix.join("profile-pictures", `${randomUUID()}-${fileName}`);
  const outputPath = path.join(process.cwd(), "public", normalized);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, data);
  return `/${normalized}`;
}
