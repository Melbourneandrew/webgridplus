import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth/session";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfileRedirectPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  redirect(`/profile/${user.id}`);
}
