import { DevelopmentPanel } from "@/features/auth/components/dev-panel";

export default function DevPage() {
  if (process.env.NODE_ENV !== "development") {
    return <p>This route is only available in development.</p>;
  }

  return <DevelopmentPanel />;
}
