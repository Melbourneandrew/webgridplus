import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth/session";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/play");
  return <SignupForm />;
}
