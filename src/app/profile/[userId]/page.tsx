import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileByUserId } from "@/services/profile/profile-service";
import { ProfileStatsCard } from "@/features/profile/components/profile-stats-card";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const profile = await getProfileByUserId(params.userId);
  return {
    title: profile ? `${profile.displayName}'s Profile` : "Profile not found",
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfileByUserId(params.userId);

  if (!profile) {
    notFound();
  }

  return <ProfileStatsCard profile={profile} />;
}
