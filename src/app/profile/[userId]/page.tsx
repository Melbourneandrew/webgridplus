import { notFound } from "next/navigation";
import { getProfileByUserId } from "@/services/profile/profile-service";
import { ProfileStatsCard } from "@/features/profile/components/profile-stats-card";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfileByUserId(params.userId);

  if (!profile) {
    notFound();
  }

  return <ProfileStatsCard profile={profile} />;
}
