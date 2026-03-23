import { fetchSources, adaptSource } from "@/lib/api";
import { statusBg, statusDot, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UrlHealthPage() {
  const res = await fetchSources();
  const sources = res.sources.map(adaptSource);

  const counts = {
    up: sources.filter(s => s.status === "up").length,
    issues: sources.filter(s => s.status !== "up").length,
  };

  const sorted = [...sources].sort((a, b) => {
    const order = { down: 0, timeout: 1, redirect: 2, up: 3 };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Source Health Monitor</h1>
        <div className="flex gap-3 text-xs">
          <span className="text-green-400">{counts.up} healthy</span>
          {counts.issues > 0 && <span className="text-yellow-400">{counts.issues} issues</span>}
          <span className="text-zinc-500">{sources.length} total</span>
        </div>
      </div>

      <div className="bg-[#1a1d27] rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-left">
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Records</th>
              <th className="px-4 py-3 font-medium">Last Polled</th>
              <th className="px-4 py-3 font-medium">Next Poll</th>
              <th className="px-4 py-3 font-medium">Errors</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(s => (
              <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${statusBg(s.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(s.status)}`} />
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-zinc-400 text-xs">{s.apiType}</td>
                <td className="px-4 py-3 text-zinc-400">{s.recordsFetched.toLocaleString()}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs">{timeAgo(s.lastChecked)}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs">{s.nextPoll ? new Date(s.nextPoll).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3 text-xs">
                  {s.errors.length > 0 ? (
                    <span className="text-red-400">{s.errors.length} error(s)</span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
