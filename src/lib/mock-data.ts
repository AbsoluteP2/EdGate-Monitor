// Mock data for EdGate Standards Monitor
// Easy to swap for real API calls later

export type Status = "current" | "changed" | "broken";
export type AlertSeverity = "high" | "medium" | "low";
export type AlertType = "new_release" | "revision" | "url_change" | "url_broken" | "cosmetic";

export interface Jurisdiction {
  id: string;
  name: string;
  abbreviation: string;
  status: Status;
  lastCrawl: string;
  changeCount: number;
  alertCount: number;
  monitoredUrls: number;
  healthScore: number; // 0-100
}

export interface MonitoredUrl {
  id: string;
  jurisdictionId: string;
  url: string;
  label: string;
  status: "up" | "redirect" | "down" | "timeout";
  lastChecked: string;
  lastSuccessful: string;
  redirectChain?: string[];
  responseTime: number; // ms
}

export interface Alert {
  id: string;
  jurisdictionId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  confidence: number; // 0-100
  createdAt: string;
  acknowledged: boolean;
  url?: string;
  diff?: { old: string; new: string };
}

export interface QueueItem {
  id: string;
  jurisdictionId: string;
  type: "confirm_standards" | "verify_url" | "investigate_down";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
  assignee?: string;
  status: "pending" | "in_progress" | "done";
}

// --- Jurisdictions ---
export const jurisdictions: Jurisdiction[] = [
  { id: "tx", name: "Texas", abbreviation: "TX", status: "current", lastCrawl: "2026-03-19T14:00:00Z", changeCount: 0, alertCount: 0, monitoredUrls: 12, healthScore: 98 },
  { id: "ca", name: "California", abbreviation: "CA", status: "changed", lastCrawl: "2026-03-19T13:30:00Z", changeCount: 3, alertCount: 2, monitoredUrls: 15, healthScore: 85 },
  { id: "ny", name: "New York", abbreviation: "NY", status: "current", lastCrawl: "2026-03-19T14:15:00Z", changeCount: 0, alertCount: 0, monitoredUrls: 11, healthScore: 100 },
  { id: "fl", name: "Florida", abbreviation: "FL", status: "broken", lastCrawl: "2026-03-18T09:00:00Z", changeCount: 0, alertCount: 3, monitoredUrls: 10, healthScore: 42 },
  { id: "il", name: "Illinois", abbreviation: "IL", status: "current", lastCrawl: "2026-03-19T12:00:00Z", changeCount: 1, alertCount: 1, monitoredUrls: 9, healthScore: 95 },
  { id: "oh", name: "Ohio", abbreviation: "OH", status: "changed", lastCrawl: "2026-03-19T11:45:00Z", changeCount: 5, alertCount: 4, monitoredUrls: 8, healthScore: 78 },
  { id: "va", name: "Virginia", abbreviation: "VA", status: "current", lastCrawl: "2026-03-19T13:00:00Z", changeCount: 0, alertCount: 0, monitoredUrls: 10, healthScore: 100 },
  { id: "wa", name: "Washington", abbreviation: "WA", status: "changed", lastCrawl: "2026-03-19T10:30:00Z", changeCount: 2, alertCount: 2, monitoredUrls: 7, healthScore: 88 },
  { id: "co", name: "Colorado", abbreviation: "CO", status: "current", lastCrawl: "2026-03-19T14:30:00Z", changeCount: 0, alertCount: 0, monitoredUrls: 8, healthScore: 97 },
  { id: "mn", name: "Minnesota", abbreviation: "MN", status: "broken", lastCrawl: "2026-03-17T08:00:00Z", changeCount: 0, alertCount: 5, monitoredUrls: 9, healthScore: 31 },
];

// --- Monitored URLs ---
export const monitoredUrls: MonitoredUrl[] = [
  { id: "url-1", jurisdictionId: "ca", url: "https://www.cde.ca.gov/be/st/ss/", label: "CA Content Standards", status: "up", lastChecked: "2026-03-19T13:30:00Z", lastSuccessful: "2026-03-19T13:30:00Z", responseTime: 245 },
  { id: "url-2", jurisdictionId: "ca", url: "https://www.cde.ca.gov/ci/ma/cf/", label: "CA Math Framework", status: "up", lastChecked: "2026-03-19T13:30:00Z", lastSuccessful: "2026-03-19T13:30:00Z", responseTime: 312 },
  { id: "url-3", jurisdictionId: "ca", url: "https://www.cde.ca.gov/ci/sc/cf/", label: "CA Science Framework", status: "redirect", lastChecked: "2026-03-19T13:30:00Z", lastSuccessful: "2026-03-18T13:30:00Z", redirectChain: ["https://www.cde.ca.gov/ci/sc/cf/", "https://www.cde.ca.gov/ci/sc/cf/ngss.asp"], responseTime: 520 },
  { id: "url-4", jurisdictionId: "fl", url: "https://www.fldoe.org/academics/standards/", label: "FL Standards Portal", status: "down", lastChecked: "2026-03-18T09:00:00Z", lastSuccessful: "2026-03-15T09:00:00Z", responseTime: 0 },
  { id: "url-5", jurisdictionId: "fl", url: "https://www.fldoe.org/academics/standards/subject/math.stml", label: "FL Math Standards", status: "down", lastChecked: "2026-03-18T09:00:00Z", lastSuccessful: "2026-03-15T09:00:00Z", responseTime: 0 },
  { id: "url-6", jurisdictionId: "fl", url: "https://www.cpalms.org/Public/", label: "FL CPALMS", status: "timeout", lastChecked: "2026-03-18T09:00:00Z", lastSuccessful: "2026-03-16T12:00:00Z", responseTime: 30000 },
  { id: "url-7", jurisdictionId: "tx", url: "https://tea.texas.gov/academics/curriculum-standards/teks/texas-essential-knowledge-and-skills", label: "TX TEKS", status: "up", lastChecked: "2026-03-19T14:00:00Z", lastSuccessful: "2026-03-19T14:00:00Z", responseTime: 189 },
  { id: "url-8", jurisdictionId: "oh", url: "https://education.ohio.gov/Topics/Learning-in-Ohio/OLS-Graphic-Sections/Learning-Standards", label: "OH Learning Standards", status: "up", lastChecked: "2026-03-19T11:45:00Z", lastSuccessful: "2026-03-19T11:45:00Z", responseTime: 456 },
  { id: "url-9", jurisdictionId: "oh", url: "https://education.ohio.gov/Topics/Learning-in-Ohio/Mathematics", label: "OH Math Standards", status: "redirect", lastChecked: "2026-03-19T11:45:00Z", lastSuccessful: "2026-03-19T11:45:00Z", redirectChain: ["https://education.ohio.gov/Topics/Learning-in-Ohio/Mathematics", "https://education.ohio.gov/Topics/Learning-in-Ohio/Mathematics/Ohio-s-Learning-Standards-in-Mathematics"], responseTime: 678 },
  { id: "url-10", jurisdictionId: "mn", url: "https://education.mn.gov/MDE/dse/stds/", label: "MN Academic Standards", status: "down", lastChecked: "2026-03-17T08:00:00Z", lastSuccessful: "2026-03-10T08:00:00Z", responseTime: 0 },
  { id: "url-11", jurisdictionId: "mn", url: "https://education.mn.gov/MDE/dse/stds/Math/", label: "MN Math Standards", status: "down", lastChecked: "2026-03-17T08:00:00Z", lastSuccessful: "2026-03-10T08:00:00Z", responseTime: 0 },
  { id: "url-12", jurisdictionId: "wa", url: "https://ospi.k12.wa.us/student-success/resources-subject-area/mathematics/mathematics-k-12-learning-standards", label: "WA Math Standards", status: "up", lastChecked: "2026-03-19T10:30:00Z", lastSuccessful: "2026-03-19T10:30:00Z", responseTime: 340 },
  { id: "url-13", jurisdictionId: "ny", url: "https://www.nysed.gov/curriculum-instruction/new-york-state-next-generation-learning-standards", label: "NY Next Gen Standards", status: "up", lastChecked: "2026-03-19T14:15:00Z", lastSuccessful: "2026-03-19T14:15:00Z", responseTime: 210 },
  { id: "url-14", jurisdictionId: "il", url: "https://www.isbe.net/Pages/Learning-Standards.aspx", label: "IL Learning Standards", status: "up", lastChecked: "2026-03-19T12:00:00Z", lastSuccessful: "2026-03-19T12:00:00Z", responseTime: 290 },
  { id: "url-15", jurisdictionId: "va", url: "https://www.doe.virginia.gov/teaching-learning-assessment/k-12-standards-of-learning", label: "VA SOL", status: "up", lastChecked: "2026-03-19T13:00:00Z", lastSuccessful: "2026-03-19T13:00:00Z", responseTime: 175 },
  { id: "url-16", jurisdictionId: "co", url: "https://www.cde.state.co.us/standardsandinstruction", label: "CO Academic Standards", status: "up", lastChecked: "2026-03-19T14:30:00Z", lastSuccessful: "2026-03-19T14:30:00Z", responseTime: 220 },
];

// --- Alerts ---
export const alerts: Alert[] = [
  {
    id: "alert-1", jurisdictionId: "ca", type: "new_release", severity: "high",
    title: "New ELA/ELD Framework Released — California",
    description: "California Department of Education published updated English Language Arts / English Language Development Framework. Major revision affecting grades K-12.",
    confidence: 94, createdAt: "2026-03-19T10:22:00Z", acknowledged: false,
    url: "https://www.cde.ca.gov/ci/rl/cf/",
    diff: {
      old: "ELA/ELD Framework (2015)\n\nChapter 1: Introduction\nThe California ELA/ELD Framework provides guidance for...\n\nStrand: Reading\n  Standard RL.1.1: Ask and answer questions about key details...\n  Standard RL.1.2: Retell stories, including key details...",
      new: "ELA/ELD Framework (2026)\n\nChapter 1: Introduction & AI Literacy Integration\nThe California ELA/ELD Framework provides guidance for...\nNEW: Integration of AI literacy across all grade bands.\n\nStrand: Reading & Media Literacy\n  Standard RL.1.1: Ask and answer questions about key details in text and digital media...\n  Standard RL.1.2: Retell stories, including key details and digital narratives...\n  NEW Standard RL.1.10: Identify AI-generated vs. human-authored text..."
    }
  },
  {
    id: "alert-2", jurisdictionId: "ca", type: "revision", severity: "medium",
    title: "Math Standards Minor Revision — California",
    description: "Updates to Appendix A of CA Math Standards. Clarification of modeling standards for grades 9-12.",
    confidence: 87, createdAt: "2026-03-18T16:45:00Z", acknowledged: false,
    url: "https://www.cde.ca.gov/ci/ma/cf/"
  },
  {
    id: "alert-3", jurisdictionId: "fl", type: "url_broken", severity: "high",
    title: "Florida DOE Standards Portal — Site Down",
    description: "The main Florida Department of Education standards portal has been returning 503 errors for 4 days. All monitored FL URLs are affected. Possible site migration in progress.",
    confidence: 99, createdAt: "2026-03-18T09:15:00Z", acknowledged: true,
    url: "https://www.fldoe.org/academics/standards/"
  },
  {
    id: "alert-4", jurisdictionId: "fl", type: "url_broken", severity: "high",
    title: "CPALMS Portal Timeout — Florida",
    description: "Florida CPALMS portal experiencing consistent timeouts (>30s). May be related to FLDOE outage.",
    confidence: 95, createdAt: "2026-03-18T09:30:00Z", acknowledged: true
  },
  {
    id: "alert-5", jurisdictionId: "fl", type: "url_change", severity: "medium",
    title: "Possible FL Standards Migration Detected",
    description: "Search engine results suggest Florida standards may be moving to a new subdomain. Found references to standards.fldoe.org in recent board meeting minutes.",
    confidence: 62, createdAt: "2026-03-19T06:00:00Z", acknowledged: false
  },
  {
    id: "alert-6", jurisdictionId: "oh", type: "new_release", severity: "high",
    title: "New Science Standards Adopted — Ohio",
    description: "Ohio State Board of Education adopted revised science standards for grades K-8. Effective for 2026-2027 school year.",
    confidence: 91, createdAt: "2026-03-19T08:00:00Z", acknowledged: false,
    diff: {
      old: "Ohio's Learning Standards for Science (2018)\n\nGrade 5 — Earth and Space Science\n  5.ESS.1: The solar system includes the sun and all celestial bodies that orbit the sun.\n  5.ESS.2: Earth's surface changes due to weathering and erosion.",
      new: "Ohio's Learning Standards for Science (2026)\n\nGrade 5 — Earth and Space Science\n  5.ESS.1: The solar system includes the sun and all celestial bodies that orbit the sun. Students explore planetary composition.\n  5.ESS.2: Earth's surface changes due to weathering, erosion, and human activity.\n  NEW 5.ESS.3: Climate systems and their interactions with human activity.\n  NEW 5.ESS.4: Sustainability and resource management."
    }
  },
  {
    id: "alert-7", jurisdictionId: "oh", type: "revision", severity: "medium",
    title: "Math Standards Clarification — Ohio",
    description: "Minor wording updates to Ohio Math Standards grade 3-5 measurement strand.",
    confidence: 78, createdAt: "2026-03-18T14:00:00Z", acknowledged: false
  },
  {
    id: "alert-8", jurisdictionId: "oh", type: "url_change", severity: "medium",
    title: "OH Math Standards URL Redirect Detected",
    description: "Ohio Mathematics standards page now redirects to a new URL structure.",
    confidence: 100, createdAt: "2026-03-19T11:50:00Z", acknowledged: false,
    url: "https://education.ohio.gov/Topics/Learning-in-Ohio/Mathematics"
  },
  {
    id: "alert-9", jurisdictionId: "oh", type: "cosmetic", severity: "low",
    title: "OH Standards Page Layout Change",
    description: "Cosmetic changes detected on Ohio Learning Standards main page. Navigation restructured but content appears unchanged.",
    confidence: 88, createdAt: "2026-03-19T11:48:00Z", acknowledged: true
  },
  {
    id: "alert-10", jurisdictionId: "wa", type: "revision", severity: "medium",
    title: "WA Math Standards Update — K-5 Number Sense",
    description: "Washington OSPI updated K-5 number sense standards. New emphasis on computational thinking connections.",
    confidence: 82, createdAt: "2026-03-19T07:15:00Z", acknowledged: false
  },
  {
    id: "alert-11", jurisdictionId: "wa", type: "url_change", severity: "medium",
    title: "WA Science Standards URL Structure Change",
    description: "OSPI science standards pages restructured. Old bookmarks may break.",
    confidence: 90, createdAt: "2026-03-18T22:00:00Z", acknowledged: false
  },
  {
    id: "alert-12", jurisdictionId: "il", type: "revision", severity: "medium",
    title: "IL Social Science Standards Minor Update",
    description: "ISBE updated social science standards with new civic literacy benchmarks for high school.",
    confidence: 75, createdAt: "2026-03-19T09:30:00Z", acknowledged: false
  },
  {
    id: "alert-13", jurisdictionId: "mn", type: "url_broken", severity: "high",
    title: "Minnesota DOE — Full Site Outage",
    description: "education.mn.gov has been unreachable for 9 days. All MN standards monitoring suspended. Multiple sources suggest a major platform migration.",
    confidence: 99, createdAt: "2026-03-17T08:15:00Z", acknowledged: true
  },
  {
    id: "alert-14", jurisdictionId: "mn", type: "url_broken", severity: "high",
    title: "MN Math Standards Page Down",
    description: "Minnesota math standards page unreachable.",
    confidence: 99, createdAt: "2026-03-17T08:16:00Z", acknowledged: true
  },
  {
    id: "alert-15", jurisdictionId: "mn", type: "url_change", severity: "medium",
    title: "Possible MN Site Migration — New Domain Found",
    description: "Discovery sweep found possible new Minnesota education portal at mn.gov/education/. Needs verification.",
    confidence: 55, createdAt: "2026-03-19T04:00:00Z", acknowledged: false
  },
];

// --- Queue Items ---
export const queueItems: QueueItem[] = [
  { id: "q-1", jurisdictionId: "ca", type: "confirm_standards", title: "Confirm CA ELA/ELD Framework changes", description: "AI extracted 47 new/modified standards from the updated framework. Review and confirm accuracy.", priority: "high", createdAt: "2026-03-19T10:25:00Z", status: "pending" },
  { id: "q-2", jurisdictionId: "oh", type: "confirm_standards", title: "Confirm OH Science Standards extraction", description: "AI extracted 23 new standards and 15 modified standards. Verify against official documents.", priority: "high", createdAt: "2026-03-19T08:05:00Z", status: "in_progress", assignee: "Sarah" },
  { id: "q-3", jurisdictionId: "fl", type: "investigate_down", title: "Investigate FL DOE outage", description: "Florida DOE has been down 4 days. Check for migration announcements, contact if needed.", priority: "high", createdAt: "2026-03-18T09:20:00Z", status: "in_progress", assignee: "Mike" },
  { id: "q-4", jurisdictionId: "mn", type: "investigate_down", title: "Investigate MN education site migration", description: "Minnesota education portal down 9 days. Possible migration to mn.gov/education/. Verify new URLs.", priority: "high", createdAt: "2026-03-17T08:20:00Z", status: "pending" },
  { id: "q-5", jurisdictionId: "mn", type: "verify_url", title: "Verify new MN education portal", description: "Check if mn.gov/education/ is the new home for Minnesota standards. Map old URLs to new.", priority: "medium", createdAt: "2026-03-19T04:05:00Z", status: "pending" },
  { id: "q-6", jurisdictionId: "oh", type: "verify_url", title: "Update OH Math Standards bookmark", description: "Ohio math standards page has redirected. Verify the new URL is stable and update registry.", priority: "medium", createdAt: "2026-03-19T11:55:00Z", status: "pending" },
  { id: "q-7", jurisdictionId: "wa", type: "confirm_standards", title: "Confirm WA K-5 Math updates", description: "AI detected updates to WA number sense standards. Review extracted changes.", priority: "medium", createdAt: "2026-03-19T07:20:00Z", status: "pending" },
  { id: "q-8", jurisdictionId: "il", type: "confirm_standards", title: "Review IL Social Science updates", description: "New civic literacy benchmarks detected. Confirm extraction accuracy.", priority: "medium", createdAt: "2026-03-19T09:35:00Z", status: "pending" },
  { id: "q-9", jurisdictionId: "fl", type: "verify_url", title: "Check standards.fldoe.org", description: "Possible new FL standards subdomain found. Verify and map existing URLs.", priority: "medium", createdAt: "2026-03-19T06:05:00Z", status: "pending" },
  { id: "q-10", jurisdictionId: "ca", type: "verify_url", title: "Verify CA Science redirect", description: "CA Science Framework page now redirects. Confirm new URL is correct.", priority: "low", createdAt: "2026-03-19T13:35:00Z", status: "pending" },
];

// Helper functions
export function getJurisdiction(id: string) { return jurisdictions.find(j => j.id === id); }
export function getUrlsForJurisdiction(id: string) { return monitoredUrls.filter(u => u.jurisdictionId === id); }
export function getAlertsForJurisdiction(id: string) { return alerts.filter(a => a.jurisdictionId === id); }
export function getAlert(id: string) { return alerts.find(a => a.id === id); }
export function getQueueForJurisdiction(id: string) { return queueItems.filter(q => q.jurisdictionId === id); }
