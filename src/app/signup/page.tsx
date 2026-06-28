import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth/session";
import { SignupForm } from "@/features/auth/components/signup-form";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/game");
  return <SignupForm />;
}
