import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EdGate Standards Monitor",
  description: "AI-powered standards change detection and monitoring",
};

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/jurisdictions", label: "Jurisdictions" },
  { href: "/alerts", label: "Alerts" },
  { href: "/url-health", label: "URL Health" },
  { href: "/queue", label: "Queue" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <nav className="border-b border-zinc-800 bg-[#0d0f15]">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-8">
            <Link href="/" className="font-bold text-lg tracking-tight">
              <span className="text-green-500">Ed</span>Gate Monitor
            </Link>
            <div className="flex gap-1">
              {nav.map(n => (
                <Link key={n.href} href={n.href}
                  className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors">
                  {n.label}
                </Link>
              ))}
            </div>
            <div className="ml-auto text-xs text-zinc-600">
              Last system crawl: 14 min ago
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
