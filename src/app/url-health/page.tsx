import { monitoredUrls, jurisdictions } from "@/lib/mock-data";
import { statusBg, statusDot, timeAgo } from "@/lib/utils";

export default function UrlHealthPage() {
  const counts = {
    up: monitoredUrls.filter(u => u.status === "up").length,
    redirect: monitoredUrls.filter(u => u.status === "redirect").length,
    down: monitoredUrls.filter(u => u.status === "down").length,
    timeout: monitoredUrls.filter(u => u.status === "timeout").length,
  };

  const sorted = [...monitoredUrls].sort((a, b) => {
    const order = { down: 0, timeout: 1, redirect: 2, up: 3 };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">URL Health Monitor</h1>
        <div className="flex gap-3 text-xs">
          <span className="text-green-400">{counts.up} up</span>
          <span className="text-yellow-400">{counts.redirect} redirect</span>
          <span className="text-red-400">{counts.down} down</span>
          <span className="text-red-400">{counts.timeout} timeout</span>
        </div>
      </div>

      <div className="bg-[#1a1d27] rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-left">
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">State</th>
              <th className="px-4 py-3 font-medium">Label</th>
              <th className="px-4 py-3 font-nedium">URL</th>
              <th className="px-4 py-3 font-medium">Response</th>
              <th className="px-4 py-3 font-medium">Last OK</th>
              <th className="px-4 py-3 font-medium">Redirects</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(u => {
              const j = jurisdictions.find(j => j.id === u.jurisdictionId);
              return (
                <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${statusBg(u.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(u.status)}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{j?.abbreviation}</td>
                  <td className="px-4 py-3 font-medium">{u.label}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs font-mono truncate max-w-xs">{u.url}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {u.responseTime > 0 ? `${u.responseTime}ms` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{timeAgo(u.lastSuccessful)}</td>
                  <td className="px-4 py-3 text-xs">
                    {u.redirectChain ? (
                      <span className="text-yellow-400">{u.redirectChain.length - 1} hop(s)</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
