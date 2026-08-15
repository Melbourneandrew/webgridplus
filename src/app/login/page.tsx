import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth/session";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/play");
  return <LoginForm />;
}
