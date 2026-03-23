import Link from "next/link";
import { fetchJurisdictions, fetchStateActivity, adaptStateToJurisdiction } from "@/lib/api";
import { statusDot, statusBg, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function JurisdictionsPage() {
  const [jurRes, stateActivity] = await Promise.all([
    fetchJurisdictions(),
    fetchStateActivity(),
  ]);

  // Build a map of state activity for enrichment
  const activityMap = new Map(stateActivity.map(s => [s.stateCode, s]));

  // Merge jurisdiction list with activity data
  const jurisdictions = jurRes.jurisdictions.map(j => {
    const activity = activityMap.get(j.code);
    if (activity) {
      return adaptStateToJurisdiction(activity);
    }
    return {
      id: j.code.toLowerCase(),
      name: j.name,
      abbreviation: j.code,
      status: "current" as const,
      lastCrawl: j.last_updated || new Date().toISOString(),
      changeCount: 0,
      alertCount: 0,
      monitoredUrls: 0,
      healthScore: 100,
    };
  });

  // Sort: broken first, then changed, then current
  const sorted = [...jurisdictions].sort((a, b) => {
    const order = { broken: 0, changed: 1, current: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Jurisdictions</h1>
      <div className="bg-[#1a1d27] rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-left">
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Jurisdiction</th>
              <th className="px-4 py-3 font-medium">Health</th>
              <th className="px-4 py-3 font-medium">Changes</th>
              <th className="px-4 py-3 font-medium">Alerts</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(j => (
              <tr key={j.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${statusBg(j.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(j.status)}`} />
                    {j.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/jurisdictions/${j.id}`} className="font-medium hover:text-green-400 transition-colors">
                    {j.name} <span className="text-zinc-500">({j.abbreviation})</span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${j.healthScore >= 80 ? "bg-green-500" : j.healthScore >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${j.healthScore}%` }} />
                    </div>
                    <span className="text-xs text-zinc-400">{j.healthScore}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {j.changeCount > 0 ? <span className="text-yellow-400">{j.changeCount.toLocaleString()}</span> : <span className="text-zinc-600">0</span>}
                </td>
                <td className="px-4 py-3">
                  {j.alertCount > 0 ? <span className="text-red-400">{j.alertCount}</span> : <span className="text-zinc-600">0</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
