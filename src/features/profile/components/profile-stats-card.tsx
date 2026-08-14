import { type ProfilePageModel } from "@/services/profile/profile-service";

export function ProfileStatsCard({ profile }: { profile: ProfilePageModel }) {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-4 text-3xl font-bold">User Profile</h1>
      <div className="rounded border p-4">
        <div className="mb-4 flex items-center gap-4">
          {profile.profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.profilePicture} alt="profile" className="h-16 w-16 rounded-full object-cover" />
          ) : null}
          <h2 className="text-xl font-semibold">{profile.displayName}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-2 font-bold">Regular</h3>
            <ProfileModeSummary stats={profile.regular} />
          </div>
          <div>
            <h3 className="mb-2 font-bold">Blitz</h3>
            <ProfileModeSummary stats={profile.blitz} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileModeSummary({ stats }: { stats: ProfilePageModel["regular"] }) {
  return (
    <div className="grid gap-2 rounded border p-3">
      <p>Rank: {stats.rank ?? "0"}</p>
      <p>Highest: {stats.highestScore !== null ? `${stats.highestScore.toFixed(2)} BPS` : "0.00 BPS"}</p>
      <p>Average: {stats.averageScore !== null ? `${stats.averageScore.toFixed(2)} BPS` : "0.00 BPS"}</p>
      <p>Games: {stats.totalGamesPlayed}</p>
    </div>
  );
}
