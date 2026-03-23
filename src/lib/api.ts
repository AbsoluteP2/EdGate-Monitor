// API client for EdGate backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8100";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "X-API-Key": API_KEY,
      ...opts?.headers,
    },
    next: { revalidate: 60 }, // cache for 60s
  });
  if (!res.ok) throw new Error(`API ${path}: ${res.status} ${res.statusText}`);
  return res.json();
}

// --- Raw API types ---
export interface ApiStats {
  total_standards: number;
  total_changes: number;
  total_documents: number;
  total_jurisdictions: number;
  recent_changes: number;
  critical_changes: number;
  subject_breakdown: { subject: string; changes: number; new: number; revised: number; retired: number }[];
  state_activity: ApiStateActivity[];
  last_updated: string;
}

export interface ApiStateActivity {
  stateCode: string;
  state: string;
  changes: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ApiChange {
  id: string;
  jurisdiction: string;
  jurisdiction_name: string;
  country: string;
  subject: string;
  grade_band: string;
  change_type: string;
  date: string;
  impact_level: string;
  standard_code: string;
  title: string;
  description: string;
  source_id: string;
  source_url: string;
  uri: string;
  source_category: string;
  affected_publishers: string[];
  affected_products: number;
  estimated_effort_days: number;
}

export interface ApiChangesResponse {
  count: number;
  total: number;
  changes: ApiChange[];
}

export interface ApiSource {
  id: string;
  name: string;
  api_type: string;
  status: string;
  last_polled: string;
  last_success: string;
  records_fetched: number;
  errors: string[];
  next_poll: string;
}

export interface ApiSourcesResponse {
  count: number;
  sources: ApiSource[];
}

export interface ApiJurisdiction {
  code: string;
  name: string;
  country: string;
  type: string;
  document_count: number;
  standard_count: number;
  last_updated: string;
  asn_uri: string;
  sources: string[];
}

export interface ApiJurisdictionsResponse {
  count: number;
  jurisdictions: ApiJurisdiction[];
}

// --- Fetchers ---
export async function fetchStats(): Promise<ApiStats> {
  return apiFetch<ApiStats>("/api/stats");
}

export async function fetchChanges(params?: { limit?: number; offset?: number; jurisdiction?: string; impact_level?: string }): Promise<ApiChangesResponse> {
  const sp = new URLSearchParams();
  if (params?.limit) sp.set("limit", String(params.limit));
  if (params?.offset) sp.set("offset", String(params.offset));
  if (params?.jurisdiction) sp.set("jurisdiction", params.jurisdiction);
  if (params?.impact_level) sp.set("impact_level", params.impact_level);
  const qs = sp.toString();
  return apiFetch<ApiChangesResponse>(`/api/changes${qs ? `?${qs}` : ""}`);
}

export async function fetchChange(id: string): Promise<ApiChange | null> {
  try {
    // Try fetching by ID — the API may support /api/changes?id=xxx or we search
    const res = await apiFetch<ApiChangesResponse>(`/api/changes?limit=1&id=${encodeURIComponent(id)}`);
    return res.changes?.[0] || null;
  } catch {
    return null;
  }
}

export async function fetchSources(): Promise<ApiSourcesResponse> {
  return apiFetch<ApiSourcesResponse>("/api/sources");
}

export async function fetchJurisdictions(): Promise<ApiJurisdictionsResponse> {
  return apiFetch<ApiJurisdictionsResponse>("/api/jurisdictions");
}

export async function fetchStateActivity(): Promise<ApiStateActivity[]> {
  return apiFetch<ApiStateActivity[]>("/api/state-activity");
}

// --- Adapters: map API data to frontend display types ---

export type Status = "current" | "changed" | "broken";
export type AlertSeverity = "high" | "medium" | "low" | "critical";

export interface FrontendJurisdiction {
  id: string;
  name: string;
  abbreviation: string;
  status: Status;
  lastCrawl: string;
  changeCount: number;
  alertCount: number;
  monitoredUrls: number;
  healthScore: number;
}

export interface FrontendAlert {
  id: string;
  jurisdictionId: string;
  jurisdictionName: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  confidence: number;
  createdAt: string;
  acknowledged: boolean;
  url?: string;
}

export interface FrontendSource {
  id: string;
  name: string;
  status: "up" | "redirect" | "down" | "timeout";
  apiType: string;
  lastChecked: string;
  lastSuccessful: string;
  recordsFetched: number;
  errors: string[];
  nextPoll: string;
}

export function adaptStateToJurisdiction(sa: ApiStateActivity): FrontendJurisdiction {
  const hasChanges = sa.changes > 0;
  const hasCritical = sa.critical > 0 || sa.high > 0;
  const status: Status = hasCritical ? "broken" : hasChanges ? "changed" : "current";
  const healthScore = hasCritical ? Math.max(20, 100 - sa.critical * 20 - sa.high * 10) : hasChanges ? Math.max(50, 100 - Math.min(sa.changes, 50)) : 100;

  return {
    id: sa.stateCode.toLowerCase(),
    name: sa.state || sa.stateCode,
    abbreviation: sa.stateCode,
    status,
    lastCrawl: new Date().toISOString(),
    changeCount: sa.changes,
    alertCount: sa.critical + sa.high,
    monitoredUrls: 0,
    healthScore: Math.round(healthScore),
  };
}

export function adaptChangeToAlert(c: ApiChange): FrontendAlert {
  return {
    id: c.id,
    jurisdictionId: c.jurisdiction,
    jurisdictionName: c.jurisdiction_name,
    type: c.change_type,
    severity: c.impact_level || "low",
    title: c.title,
    description: c.description,
    confidence: c.impact_level === "critical" ? 95 : c.impact_level === "high" ? 85 : c.impact_level === "medium" ? 70 : 50,
    createdAt: c.date,
    acknowledged: false,
    url: c.source_url || undefined,
  };
}

export function adaptSource(s: ApiSource): FrontendSource {
  const hasErrors = s.errors && s.errors.length > 0;
  const status: FrontendSource["status"] = s.status === "success" && !hasErrors ? "up" : s.status === "error" ? "down" : hasErrors ? "redirect" : "up";
  return {
    id: s.id,
    name: s.name,
    status,
    apiType: s.api_type,
    lastChecked: s.last_polled,
    lastSuccessful: s.last_success,
    recordsFetched: s.records_fetched,
    errors: s.errors,
    nextPoll: s.next_poll,
  };
}
