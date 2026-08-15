import { redirect } from "next/navigation";

interface LegacyGamePageProps {
  searchParams?: {
    mode?: string | string[];
  };
}

export default function LegacyGamePage({ searchParams }: LegacyGamePageProps) {
  const mode = Array.isArray(searchParams?.mode) ? searchParams.mode[0] : searchParams?.mode;
  redirect(mode ? `/play?mode=${encodeURIComponent(mode)}` : "/play");
}
