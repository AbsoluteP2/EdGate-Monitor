import Link from "next/link";
import { jurisdictions, getUrlsForJurisdiction, getAlertsForJurisdiction } from "@/lib/mock-data";
import { statusBg, statusDot, timeAgo, severityBg } from "@/lib/utils";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return jurisdictions.map(j => ({ state: j.id }));
}

export default async function StateDetail({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const j = jurisdictions.find(j => j.id === state);
  if (!j) notFound();

  const urls = getUrlsForJurisdiction(state);
  const stateAlerts = getAlertsForJurisdiction(state);

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
          { label: "Monitored URLs", value: urls.length },
          { label: "Active Alerts", value: stateAlerts.filter(a => !a.acknowledged).length },
          { label: "Last Crawl", value: timeAgo(j.lastCrawl) },
        ].map(s => (
          <div key={s.label} className="bg-[#1a1d27] rounded-lg border border-zinc-800 p-4">
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-sm text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Monitored URLs */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Monitored URLs</h2>
        <div className="bg-[#1a1d27] rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Label</th>
                <th className="px-4 py-3 font-medium">URL</th>
                <th className="px-4 py-3 font-medium">Response</th>
                <th className="px-4 py-3 font-medium">Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {urls.map(u => (
                <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${statusBg(u.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(u.status)}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{u.label}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs font-mono truncate max-w-xs">{u.url}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {u.responseTime > 0 ? `${u.responseTime}ms` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{timeAgo(u.lastChecked)}</td>
                </tr>
              ))}
              {urls.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500">No monitored URLs</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Alerts</h2>
        <div className="space-y-2">
          {stateAlerts.length === 0 && <div className="text-zinc-500 text-sm">No alerts for this jurisdiction.</div>}
          {stateAlerts.map(a => (
            <Link key={a.id} href={`/alerts/${a.id}`}
              className="flex items-center gap-4 bg-[#1a1d27] rounded-lg border border-zinc-800 p-3 hover:border-zinc-600 transition-colors">
              <span className={`px-2 py-0.5 rounded text-xs border ${severityBg(a.severity)}`}>{a.severity}</span>
              <span className="text-sm flex-1">{a.title}</span>
              {a.acknowledged && <span className="text-xs text-zinc-600">ack</span>}
              <span className="text-xs text-zinc-600">{timeAgo(a.createdAt)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
