import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth/session";

export default async function ProfileRedirectPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  redirect(`/profile/${user.id}`);
}
