import { fetchChanges, adaptChangeToAlert } from "@/lib/api";
import { severityBg, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  // Fetch high-impact changes as queue items
  const [criticalRes, highRes] = await Promise.all([
    fetchChanges({ limit: 50, impact_level: "critical" }),
    fetchChanges({ limit: 50, impact_level: "high" }),
  ]);

  const allChanges = [...criticalRes.changes, ...highRes.changes];
  const alerts = allChanges.map(adaptChangeToAlert);
  const sorted = [...alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const typeColor: Record<string, string> = {
    new_standard: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    revision: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    retired: "bg-red-500/15 text-red-400 border-red-500/30",
    under_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Action Queue</h1>
        <div className="flex gap-3 text-xs text-zinc-500">
          <span>{sorted.length} items requiring attention</span>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Critical & High Impact Changes</h2>
        <div className="space-y-2">
          {sorted.map(a => (
            <div key={a.id} className="bg-[#1a1d27] rounded-lg border border-zinc-800 p-4 hover:border-zinc-600 transition-colors">
              <div className="flex items-start gap-3">
                <span className={`px-2 py-0.5 rounded text-xs border ${severityBg(a.severity)}`}>{a.severity}</span>
                <span className={`px-2 py-0.5 rounded text-xs border ${typeColor[a.type] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"}`}>{a.type.replace(/_/g, " ")}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-zinc-500 mt-1 line-clamp-2">{a.description}</div>
                  <div className="flex gap-3 mt-2 text-xs text-zinc-600">
                    <span>{a.jurisdictionId}</span>
                    <span>{timeAgo(a.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="text-center text-zinc-500 py-8">No critical or high-impact changes in the queue. 🎉</div>
          )}
        </div>
      </div>
    </div>
  );
}
