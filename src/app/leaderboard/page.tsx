import Link from "next/link";
import { getLeaderboardPage } from "@/services/leaderboard/leaderboard-service";
import { gameModes, type GameModeName } from "@/domain/game/mode";

interface SearchParams {
  searchParams?: {
    mode?: string;
  };
}

export default async function LeaderboardPage({
  searchParams,
}: SearchParams) {
  const mode =
    searchParams?.mode === "blitz" ? "blitz" : ("regular" as GameModeName);
  const rows = await getLeaderboardPage(mode);

  return (
    <section className="mx-auto max-w-6xl">
      <h1 className="mb-4 text-3xl font-bold">{mode === "regular" ? "Regular" : "Blitz"} Leaderboard</h1>
      <div className="mb-4 flex gap-2">
        {gameModes.map((item) => (
          <Link
            key={item}
            href={`/leaderboard?mode=${item}`}
            className={`rounded border px-4 py-2 ${
              mode === item ? "bg-black text-white" : "bg-white"
            }`}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </Link>
        ))}
      </div>
      <table className="w-full border-collapse border border-black/20">
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
                <Link href={`/profile/${row.userId}`}>{row.displayName}</Link>
              </td>
              <td className="border p-2">{row.bps.toFixed(2)}</td>
              <td className="border p-2">{new Date(row.playedAt).toLocaleDateString()}</td>
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
