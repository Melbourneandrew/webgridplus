import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { getLeaderboardPage } from "@/services/leaderboard/leaderboard-service";
import { gameModes, type GameModeName } from "@/domain/game/modes";
import { GameModeTabs } from "@/features/game/components/game-mode-tabs";

interface SearchParams {
  searchParams?: {
    mode?: string;
  };
}

export const metadata: Metadata = {
  title: "Leaderboard",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeaderboardPage({
  searchParams,
}: SearchParams) {
  noStore();
  const mode =
    searchParams?.mode === "blitz" ? "blitz" : ("regular" as GameModeName);
  const rows = await getLeaderboardPage(mode);

  return (
    <section className="mx-auto max-w-6xl">
      <h1 className="mb-4 text-3xl font-bold">{mode === "regular" ? "Regular" : "Blitz"} Leaderboard</h1>
      <div className="mb-4">
        <GameModeTabs activeMode={mode} availableModes={gameModes} />
      </div>
      <table className="w-full table-fixed border-collapse border border-black/20">
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[58%]" />
          <col className="w-[14%]" />
          <col className="w-[18%]" />
        </colgroup>
        <thead>
          <tr>
            <th className="border p-2 text-left">Rank</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">BPS</th>
            <th className="border p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100">
              <td className="border p-2">{row.rank}</td>
              <td className="border p-2">
                <Link className="block truncate" title={row.displayName} href={`/profile/${row.userId}`}>{row.displayName}</Link>
              </td>
              <td className="border p-2 tabular-nums whitespace-nowrap">{row.bps.toFixed(2)}</td>
              <td className="border p-2 whitespace-nowrap">{new Date(row.playedAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="border p-3 text-center text-gray-500">No games yet.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
