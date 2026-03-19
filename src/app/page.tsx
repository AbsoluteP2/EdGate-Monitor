import Link from "next/link";
import { jurisdictions, alerts, queueItems } from "@/lib/mock-data";
import { statusDot, statusBg, timeAgo } from "@/lib/utils";

export default function Dashboard() {
  const counts = {
    current: jurisdictions.filter(j => j.status === "current").length,
    changed: jurisdictions.filter(j => j.status === "changed").length,
    broken: jurisdictions.filter(j => j.status === "broken").length,
  };
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;
  const pendingQueue = queueItems.filter(q => q.status === "pending").length;

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
          { label: "Jurisdictions", value: jurisdictions.length, sub: "monitored" },
          { label: "Active Alerts", value: unacknowledged, sub: "unacknowledged" },
          { label: "Queue Items", value: pendingQueue, sub: "pending" },
          { label: "Avg Health", value: Math.round(jurisdictions.reduce((a, j) => a + j.healthScore, 0) / jurisdictions.length) + "%", sub: "across all states" },
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
        <h2 className="text-lg font-semibold mb-3">Jurisdictions</h2>
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
                  {j.status}
                </span>
                {j.alertCount > 0 && (
                  <span className="text-red-400">{j.alertCount} alerts</span>
                )}
              </div>
              <div className="mt-2 text-xs text-zinc-600">
                Health: {j.healthScore}% · {timeAgo(j.lastCrawl)}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Alerts</h2>
          <Link href="/alerts" className="text-sm text-zinc-400 hover:text-zinc-200">View all →</Link>
        </div>
        <div className="space-y-2">
          {alerts.filter(a => !a.acknowledged).slice(0, 5).map(a => {
            const j = jurisdictions.find(j => j.id === a.jurisdictionId);
            return (
              <Link key={a.id} href={`/alerts/${a.id}`}
                className="flex items-center gap-4 bg-[#1a1d27] rounded-lg border border-zinc-800 p-3 hover:border-zinc-600 transition-colors">
                <span className={`px-2 py-0.5 rounded text-xs border ${a.severity === "high" ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"}`}>
                  {a.severity}
                </span>
                <span className="text-sm font-medium flex-1">{a.title}</span>
                <span className="text-xs text-zinc-500">{j?.abbreviation}</span>
                <span className="text-xs text-zinc-600">{timeAgo(a.createdAt)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
