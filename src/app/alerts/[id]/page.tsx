import Link from "next/link";
import { fetchChanges, adaptChangeToAlert } from "@/lib/api";
import { severityBg, timeAgo, confidenceColor } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AlertDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Try to find the change by fetching recent changes and filtering
  // The API may not support direct ID lookup, so we fetch a batch
  const res = await fetchChanges({ limit: 200 });
  const change = res.changes.find(c => c.id === id);
  if (!change) notFound();

  const alert = adaptChangeToAlert(change);

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
              <span>Jurisdiction: <span className="text-zinc-300">{alert.jurisdictionName}</span></span>
              <span>Type: {alert.type.replace(/_/g, " ")}</span>
              <span>{timeAgo(alert.createdAt)}</span>
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
            <a href={alert.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 font-mono hover:text-green-400">{alert.url}</a>
          </div>
        )}

        {/* Extra metadata from API */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
          <div>
            <div className="text-xs text-zinc-500">Subject</div>
            <div className="text-sm">{change.subject || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Grade Band</div>
            <div className="text-sm">{change.grade_band || "All"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Source Category</div>
            <div className="text-sm">{change.source_category?.replace(/_/g, " ") || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Affected Publishers</div>
            <div className="text-sm">{change.affected_publishers?.length > 0 ? change.affected_publishers.join(", ") : "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Affected Products</div>
            <div className="text-sm">{change.affected_products || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Est. Effort</div>
            <div className="text-sm">{change.estimated_effort_days ? `${change.estimated_effort_days} days` : "—"}</div>
          </div>
        </div>
      </div>

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
