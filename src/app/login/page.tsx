import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth/session";
import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/game");
  return <LoginForm />;
}
