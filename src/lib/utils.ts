import type { Status } from "./mock-data";

export function statusColor(status: Status | string): string {
  switch (status) {
    case "current": case "up": return "text-green-500";
    case "changed": case "redirect": return "text-yellow-500";
    case "broken": case "down": case "timeout": return "text-red-500";
    default: return "text-zinc-400";
  }
}

export function statusBg(status: Status | string): string {
  switch (status) {
    case "current": case "up": return "bg-green-500/15 text-green-400 border-green-500/30";
    case "changed": case "redirect": return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    case "broken": case "down": case "timeout": return "bg-red-500/15 text-red-400 border-red-500/30";
    default: return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  }
}

export function statusDot(status: Status | string): string {
  switch (status) {
    case "current": case "up": return "bg-green-500";
    case "changed": case "redirect": return "bg-yellow-500";
    case "broken": case "down": case "timeout": return "bg-red-500";
    default: return "bg-zinc-500";
  }
}

export function severityBg(severity: string): string {
  switch (severity) {
    case "high": return "bg-red-500/15 text-red-400 border-red-500/30";
    case "medium": return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    case "low": return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
    default: return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  }
}

export function timeAgo(dateStr: string): string {
  const now = new Date("2026-03-19T23:00:00Z"); // mock "now"
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function confidenceColor(confidence: number): string {
  if (confidence >= 90) return "text-green-400";
  if (confidence >= 70) return "text-yellow-400";
  return "text-red-400";
}
