import Link from "next/link";
import { alerts, jurisdictions } from "@/lib/mock-data";
import { severityBg, timeAgo, confidenceColor } from "@/lib/utils";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return alerts.map(a => ({ id: a.id }));
}

export default async function AlertDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const alert = alerts.find(a => a.id === id);
  if (!alert) notFound();

  const j = jurisdictions.find(j => j.id === alert.jurisdictionId);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/alerts" className="text-zinc-500 hover:text-zinc-300">← Alerts</Link>
      </div>

      <div className="bg-[#1a1d27] rounded-lg border border-zinc-800 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className={`px-2 py-0.5 rounded text-xs border ${severityBg(alert.severity)}`}>{alert.severity}</span>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{alert.title}</h1>
            <div className="flex gap-4 mt-2 text-xs text-zinc-500">
              <span>Jurisdiction: <Link href={`/jurisdictions/${alert.jurisdictionId}`} className="text-zinc-300 hover:text-green-400">{j?.name}</Link></span>
              <span>Type: {alert.type.replace(/_/g, " ")}</span>
              <span>{timeAgo(alert.createdAt)}</span>
              {alert.acknowledged && <span className="text-green-500">✓ Acknowledged</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500">Confidence</div>
            <div className={`text-2xl font-bold ${confidenceColor(alert.confidence)}`}>{alert.confidence}%</div>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">{alert.description}</p>

        {alert.url && (
          <div className="text-xs">
            <span className="text-zinc-500">Source: </span>
            <span className="text-zinc-400 font-mono">{alert.url}</span>
          </div>
        )}
      </div>

      {/* Diff View */}
      {alert.diff && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Standards Diff</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1d27] rounded-lg border border-red-500/20 p-4">
              <div className="text-xs text-red-400 font-medium mb-3 uppercase tracking-wide">Previous Version</div>
              <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed">{alert.diff.old}</pre>
            </div>
            <div className="bg-[#1a1d27] rounded-lg border border-green-500/20 p-4">
              <div className="text-xs text-green-400 font-medium mb-3 uppercase tracking-wide">New Version</div>
              <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                {alert.diff.new.split("\n").map((line, i) => (
                  <span key={i} className={line.includes("NEW") ? "text-green-400 font-semibold" : ""}>
                    {line}{"\n"}
                  </span>
                ))}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
          Acknowledge
        </button>
        <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg transition-colors">
          Create Queue Item
        </button>
        <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg transition-colors">
          Dismiss as Noise
        </button>
      </div>
    </div>
  );
}
