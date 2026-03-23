import Link from "next/link";
import { fetchChanges, adaptChangeToAlert } from "@/lib/api";
import { severityBg, timeAgo, confidenceColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const res = await fetchChanges({ limit: 100 });
  const alerts = res.changes.map(adaptChangeToAlert);
  const sorted = [...alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alerts</h1>
        <div className="flex gap-2 text-xs">
          {["critical", "high", "medium", "low"].map(s => {
            const count = alerts.filter(a => a.severity === s).length;
            if (count === 0) return null;
            return (
              <span key={s} className={`px-2 py-1 rounded border ${severityBg(s)}`}>
                {count} {s}
              </span>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map(a => (
          <Link key={a.id} href={`/alerts/${a.id}`}
            className="flex items-center gap-4 bg-[#1a1d27] rounded-lg border border-zinc-800 p-4 hover:border-zinc-600 transition-colors">
            <span className={`px-2 py-0.5 rounded text-xs border shrink-0 ${severityBg(a.severity)}`}>
              {a.severity}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{a.title}</div>
              <div className="text-xs text-zinc-500 mt-0.5 truncate">{a.description}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-zinc-500">{a.jurisdictionId}</div>
              <div className={`text-xs ${confidenceColor(a.confidence)}`}>{a.confidence}%</div>
            </div>
            <div className="text-xs text-zinc-600 shrink-0 w-16 text-right">{timeAgo(a.createdAt)}</div>
          </Link>
        ))}
        {sorted.length === 0 && (
          <div className="text-center text-zinc-500 py-8">No alerts found.</div>
        )}
      </div>
    </div>
  );
}
