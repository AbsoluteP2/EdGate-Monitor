import Link from "next/link";
import { fetchStats, fetchChanges, adaptStateToJurisdiction, adaptChangeToAlert } from "@/lib/api";
import { statusDot, statusBg, timeAgo, severityBg } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [stats, changesRes] = await Promise.all([
    fetchStats(),
    fetchChanges({ limit: 10 }),
  ]);

  const stateActivity = stats.state_activity || [];
  const jurisdictions = stateActivity
    .filter(s => s.state && s.state.length > 0)
    .slice(0, 20)
    .map(adaptStateToJurisdiction);

  const recentAlerts = changesRes.changes.map(adaptChangeToAlert);

  const counts = {
    current: jurisdictions.filter(j => j.status === "current").length,
    changed: jurisdictions.filter(j => j.status === "changed").length,
    broken: jurisdictions.filter(j => j.status === "broken").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Standards Monitor</h1>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> {counts.current} Current</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> {counts.changed} Changed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> {counts.broken} Broken</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Jurisdictions", value: stats.total_jurisdictions, sub: "monitored" },
          { label: "Total Changes", value: stats.recent_changes.toLocaleString(), sub: "recent" },
          { label: "Critical", value: stats.critical_changes, sub: "need attention" },
          { label: "Standards", value: stats.total_standards.toLocaleString(), sub: "tracked" },
        ].map(s => (
          <div key={s.label} className="bg-[#1a1d27] rounded-lg border border-zinc-800 p-4">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-zinc-400">{s.label}</div>
            <div className="text-xs text-zinc-600 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Jurisdiction Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Top Jurisdictions by Activity</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {jurisdictions.map(j => (
            <Link key={j.id} href={`/jurisdictions/${j.id}`}
              className="bg-[#1a1d27] rounded-lg border border-zinc-800 p-4 hover:border-zinc-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${statusDot(j.status)}`} />
                <span className="font-semibold">{j.abbreviation}</span>
              </div>
              <div className="text-xs text-zinc-400">{j.name}</div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded border ${statusBg(j.status)}`}>
                  {j.changeCount.toLocaleString()} changes
                </span>
              </div>
              <div className="mt-2 text-xs text-zinc-600">
                Health: {j.healthScore}%
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Changes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Changes</h2>
          <Link href="/alerts" className="text-sm text-zinc-400 hover:text-zinc-200">View all →</Link>
        </div>
        <div className="space-y-2">
          {recentAlerts.map(a => (
            <Link key={a.id} href={`/alerts/${a.id}`}
              className="flex items-center gap-4 bg-[#1a1d27] rounded-lg border border-zinc-800 p-3 hover:border-zinc-600 transition-colors">
              <span className={`px-2 py-0.5 rounded text-xs border ${severityBg(a.severity)}`}>
                {a.severity}
              </span>
              <span className="text-sm font-medium flex-1 truncate">{a.title}</span>
              <span className="text-xs text-zinc-500">{a.jurisdictionId}</span>
              <span className="text-xs text-zinc-600">{timeAgo(a.createdAt)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
