import Link from "next/link";
import { fetchJurisdictions, fetchChanges, fetchStateActivity, adaptStateToJurisdiction, adaptChangeToAlert } from "@/lib/api";
import { statusBg, timeAgo, severityBg } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StateDetail({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const stateUpper = state.toUpperCase();

  const [jurRes, stateActivity, changesRes] = await Promise.all([
    fetchJurisdictions(),
    fetchStateActivity(),
    fetchChanges({ limit: 50, jurisdiction: stateUpper }),
  ]);

  const jur = jurRes.jurisdictions.find(j => j.code.toLowerCase() === state.toLowerCase());
  if (!jur) notFound();

  const activity = stateActivity.find(s => s.stateCode === stateUpper);
  const j = activity ? adaptStateToJurisdiction(activity) : {
    id: jur.code.toLowerCase(),
    name: jur.name,
    abbreviation: jur.code,
    status: "current" as const,
    lastCrawl: jur.last_updated || new Date().toISOString(),
    changeCount: 0,
    alertCount: 0,
    monitoredUrls: 0,
    healthScore: 100,
  };

  const stateAlerts = changesRes.changes.map(adaptChangeToAlert);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/jurisdictions" className="text-zinc-500 hover:text-zinc-300">← Back</Link>
        <h1 className="text-2xl font-bold">{j.name}</h1>
        <span className={`px-2 py-0.5 rounded text-xs border ${statusBg(j.status)}`}>{j.status}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Health Score", value: `${j.healthScore}%` },
          { label: "Total Changes", value: j.changeCount.toLocaleString() },
          { label: "High/Critical", value: j.alertCount },
          { label: "Country", value: jur.country },
        ].map(s => (
          <div key={s.label} className="bg-[#1a1d27] rounded-lg border border-zinc-800 p-4">
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-sm text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Changes */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Changes</h2>
        <div className="space-y-2">
          {stateAlerts.length === 0 && <div className="text-zinc-500 text-sm">No recent changes for this jurisdiction.</div>}
          {stateAlerts.map(a => (
            <Link key={a.id} href={`/alerts/${a.id}`}
              className="flex items-center gap-4 bg-[#1a1d27] rounded-lg border border-zinc-800 p-3 hover:border-zinc-600 transition-colors">
              <span className={`px-2 py-0.5 rounded text-xs border ${severityBg(a.severity)}`}>{a.severity}</span>
              <span className="text-sm flex-1 truncate">{a.title}</span>
              <span className="text-xs text-zinc-600">{timeAgo(a.createdAt)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
