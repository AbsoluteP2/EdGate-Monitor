import { queueItems, jurisdictions } from "@/lib/mock-data";
import { severityBg, timeAgo } from "@/lib/utils";

export default function QueuePage() {
  const pending = queueItems.filter(q => q.status === "pending");
  const inProgress = queueItems.filter(q => q.status === "in_progress");
  const done = queueItems.filter(q => q.status === "done");

  const typeLabel: Record<string, string> = {
    confirm_standards: "Confirm Standards",
    verify_url: "Verify URL",
    investigate_down: "Investigate",
  };

  const typeColor: Record<string, string> = {
    confirm_standards: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    verify_url: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    investigate_down: "bg-red-500/15 text-red-400 border-red-500/30",
  };

  function renderItems(items: typeof queueItems) {
    return items.map(q => {
      const j = jurisdictions.find(j => j.id === q.jurisdictionId);
      return (
        <div key={q.id} className="bg-[#1a1d27] rounded-lg border border-zinc-800 p-4 hover:border-zinc-600 transition-colors">
          <div className="flex items-start gap-3">
            <span className={`px-2 py-0.5 rounded text-xs border ${severityBg(q.priority)}`}>{q.priority}</span>
            <span className={`px-2 py-0.5 rounded text-xs border ${typeColor[q.type] || ""}`}>{typeLabel[q.type]}</span>
            <div className="flex-1">
              <div className="text-sm font-medium">{q.title}</div>
              <div className="text-xs text-zinc-500 mt-1">{q.description}</div>
              <div className="flex gap-3 mt-2 text-xs text-zinc-600">
                <span>{j?.abbreviation}</span>
                <span>{timeAgo(q.createdAt)}</span>
                {q.assignee && <span className="text-zinc-400">→ {q.assignee}</span>}
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Action Queue</h1>
        <div className="flex gap-3 text-xs text-zinc-500">
          <span>{pending.length} pending</span>
          <span>{inProgress.length} in progress</span>
        </div>
      </div>

      {inProgress.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">In Progress</h2>
          <div className="space-y-2">{renderItems(inProgress)}</div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Pending</h2>
        <div className="space-y-2">{renderItems(pending)}</div>
      </div>

      {done.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Done</h2>
          <div className="space-y-2 opacity-50">{renderItems(done)}</div>
        </div>
      )}
    </div>
  );
}
