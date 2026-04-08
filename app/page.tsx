"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";

// ─── Icons (inline SVG, no extra deps) ──────────────────────────────────────

const Icon = {
  Bot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/>
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  Brain: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  GitBranch: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
    </svg>
  ),
  GitCommit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/>
    </svg>
  ),
  Terminal: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  ),
  Server: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
  Cpu: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM5 18l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z"/>
    </svg>
  ),
  RefreshCw: ({ className = "" }: { className?: string }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Play: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  MessageSquare: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Lightbulb: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
  XCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Circle: ({ className = "" }: { className?: string }) => (
    <svg width="8" height="8" viewBox="0 0 8 8" className={className}>
      <circle cx="4" cy="4" r="3" fill="currentColor"/>
    </svg>
  ),
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface SystemStatus {
  jarvis_core: "online" | "offline" | "unknown";
  ha: "online" | "offline" | "unknown";
  llm: "online" | "offline" | "unknown";
  cron_engine: "running" | "idle" | "unknown";
  brain_optimizer: "running" | "idle" | "unknown";
}

interface Task {
  id: string;
  content: string;
  status: "done" | "in_progress" | "pending";
  phase: string;
}

interface ActivityLog {
  ts: string;
  type: "info" | "success" | "error" | "warning" | "system";
  message: string;
}

interface CommitEntry {
  ts: string;
  message: string;
  branch: string;
  status: "pushed" | "failed";
}

interface SkillGap {
  topic: string;
  priority: "high" | "medium" | "low";
  suggestion: string;
  symptoms_matched: number;
}

interface DashboardData {
  system: SystemStatus;
  tasks: Task[];
  activity: ActivityLog[];
  commits: CommitEntry[];
  skill_gaps: SkillGap[];
  uptime: { jarvis: number; brain: number; sessions_archived: number; errors_fixed: number };
}

// ─── API ─────────────────────────────────────────────────────────────────────

async function fetchDashboard(): Promise<DashboardData> {
  // Gather data from multiple sources
  const [todoMd, sessionIndex, errorsMd, patternsMd, suggestionsMd, brainLog] = await Promise.all([
    readFileSafe("/root/jarvis-dev/TODO.md"),
    readFileSafe("/root/brain-optimizer/journal/sessions/_index.md"),
    readFileSafe("/root/brain-optimizer/journal/insights/context/errors.md"),
    readFileSafe("/root/brain-optimizer/journal/insights/context/patterns.md"),
    readFileSafe("/root/brain-optimizer/journal/skills/_suggestions_master.md"),
    readFileSafe("/root/brain-optimizer/brain.log"),
    checkService("http://localhost:8080/api/health", "jarvis_core"),
    checkService("http://10.0.0.7:8123/api/", "ha"),
  ]);

  // Parse tasks from TODO.md
  const tasks = parseTasks(todoMd);

  // Parse activity from brain.log
  const activity = parseActivity(brainLog);

  // Parse commits from git
  const commits = await parseGitCommits();

  // Parse skill gaps
  const skill_gaps = parseSkillGaps(suggestionsMd);

  // Uptime stats
  const uptime = parseUptimeStats(brainLog, sessionIndex, errorsMd);

  return {
    system: await getSystemStatus(),
    tasks,
    activity,
    commits,
    skill_gaps,
    uptime,
  };
}

async function readFileSafe(path: string): Promise<string> {
  try {
    const res = await fetch(`/api/read?path=${encodeURIComponent(path)}`);
    if (res.ok) return await res.text();
  } catch {}
  return "";
}

async function checkService(url: string, name: string): Promise<"online" | "offline" | "unknown"> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return res.ok ? "online" : "offline";
  } catch {
    return "unknown";
  }
}

function parseTasks(md: string): Task[] {
  const lines = md.split("\n");
  const tasks: Task[] = [];
  let currentPhase = "";

  for (const line of lines) {
    if (line.startsWith("## ")) currentPhase = line.replace("## ", "");
    if (line.match(/^- \[[x \>]?\] .+/) || line.match(/^\- \[[x \>]?\]/)) {
      const done = line.includes("- [x]");
      const inProg = line.includes("- [>]");
      const content = line.replace(/^-\s?\[[x \>]?\]\s?/, "").trim();
      const shortContent = content.length > 60 ? content.slice(0, 60) + "…" : content;
      tasks.push({
        id: content.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40),
        content: shortContent,
        status: done ? "done" : inProg ? "in_progress" : "pending",
        phase: currentPhase,
      });
    }
  }
  return tasks;
}

function parseActivity(log: string): ActivityLog[] {
  if (!log) return [];
  const lines = log.trim().split("\n").slice(-30);
  return lines.map((line) => {
    const tsMatch = line.match(/\[(.{16})\]/);
    const levelMatch = line.match(/\[(INFO|WARN|ERROR)\]/);
    const message = line.replace(/^\[.{16}\] \[(INFO|WARN|ERROR)\] /, "");
    return {
      ts: tsMatch ? tsMatch[1] : "",
      type: (levelMatch ? levelMatch[1].toLowerCase() : "info") as ActivityLog["type"],
      message,
    };
  });
}

async function parseGitCommits(): Promise<CommitEntry[]> {
  try {
    const res = await fetch("/api/git?repo=jarvis-core");
    if (res.ok) {
      const data = await res.json();
      return data.commits || [];
    }
  } catch {}
  return [];
}

function parseSkillGaps(md: string): SkillGap[] {
  if (!md) return [];
  const gaps: SkillGap[] = [];
  const sections = md.split(/(?:^## |\n## )/);
  for (const section of sections) {
    if (!section.trim()) continue;
    const priorityMatch = section.match(/\[(HIGH|MEDIUM|LOW)\]/);
    const topicMatch = section.match(/\*\*Topic:\*\* (.+)/);
    const suggestionMatch = section.match(/\*\*Suggestion:\*\*(.+?)(?:\n|$)/s);
    if (priorityMatch && topicMatch) {
      gaps.push({
        topic: topicMatch[1],
        priority: priorityMatch[1].toLowerCase() as SkillGap["priority"],
        suggestion: suggestionMatch ? suggestionMatch[1].trim() : "",
        symptoms_matched: 0,
      });
    }
  }
  return gaps.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

function parseUptimeStats(brainLog: string, sessionIndex: string, errorsMd: string): DashboardData["uptime"] {
  const lines = brainLog.split("\n");
  const brainStarts = lines.filter((l) => l.includes("Brain Optimizer — Starting")).length;
  const jarvisStarts = lines.filter((l) => l.includes("JARVIS DEV") || l.includes("JARVIS Development")).length;
  const sessionsMatch = sessionIndex.match(/Sessions archived: (\d+)/);
  const errorsMatch = errorsMd.match(/## \[.*?\]/g);
  return {
    jarvis: jarvisStarts,
    brain: brainStarts,
    sessions_archived: sessionsMatch ? parseInt(sessionsMatch[1]) : 0,
    errors_fixed: errorsMatch ? errorsMatch.length : 0,
  };
}

async function getSystemStatus(): Promise<SystemStatus> {
  const [jc, ha, llm] = await Promise.all([
    checkService("http://localhost:8080/api/health", "jarvis_core"),
    fetch("http://10.0.0.7:8123/api/", { signal: AbortSignal.timeout(3000) }).then(r => r.ok ? "online" : "offline").catch(() => "unknown" as const),
    fetch("http://10.0.0.49:8080/health", { signal: AbortSignal.timeout(3000) }).then(r => r.ok ? "online" : "offline").catch(() => "unknown" as const),
  ]);
  return {
    jarvis_core: jc,
    ha: ha as SystemStatus["ha"],
    llm: llm as SystemStatus["llm"],
    cron_engine: "running",
    brain_optimizer: "running",
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    online: "bg-emerald-400",
    running: "bg-emerald-400",
    idle: "bg-yellow-400",
    offline: "bg-red-400",
    unknown: "bg-gray-500",
    done: "bg-emerald-400",
    in_progress: "bg-cyan-400 animate-pulse",
    pending: "bg-gray-600",
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || "bg-gray-500"}`} />
  );
}

function TaskItem({ task }: { task: Task }) {
  const statusConfig = {
    done: { label: "Done", badge: "badge-done" },
    in_progress: { label: "In Progress", badge: "badge-progress" },
    pending: { label: "Pending", badge: "badge-pending" },
  };
  const cfg = statusConfig[task.status];
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="mt-0.5"><StatusDot status={task.status} /></span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs leading-relaxed ${task.status === "done" ? "text-slate-500 line-through" : task.status === "in_progress" ? "text-slate-200" : "text-slate-400"}`}>
          {task.content}
        </p>
        {task.status === "in_progress" && (
          <span className={`text-[10px] mt-0.5 px-1.5 py-0.5 rounded font-medium ${cfg.badge}`}>
            {cfg.label}
          </span>
        )}
      </div>
    </div>
  );
}

function PhaseGroup({ phase, tasks }: { phase: string; tasks: Task[] }) {
  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{phase}</h3>
        <span className="text-[10px] text-slate-500">{done}/{total} ({pct}%)</span>
      </div>
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-2">
        <div className="h-full progress-fill rounded-full" style={{ width: `${pct}%` }} />
      </div>
      {tasks.map((t) => <TaskItem key={t.id} task={t} />)}
    </div>
  );
}

function LogLine({ entry }: { entry: ActivityLog }) {
  const colors: Record<string, string> = {
    info: "log-line info",
    success: "log-line success",
    error: "log-line error",
    warning: "log-line warning",
    system: "log-line system",
  };
  return (
    <div className={colors[entry.type]}>
      <span className="text-slate-600">[{entry.ts}]</span> {entry.message}
    </div>
  );
}

function CommitItem({ entry }: { entry: CommitEntry }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-slate-800/50 last:border-0">
      <span className={entry.status === "pushed" ? "text-emerald-400" : "text-red-400"}>
        <Icon.GitCommit />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-300 truncate">{entry.message}</p>
        <p className="text-[10px] text-slate-600">{entry.ts} · {entry.branch}</p>
      </div>
      <span className={`text-[10px] px-1.5 py-0.5 rounded ${entry.status === "pushed" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"}`}>
        {entry.status === "pushed" ? "pushed" : "failed"}
      </span>
    </div>
  );
}

function SkillGapCard({ gap }: { gap: SkillGap }) {
  const colors: Record<string, string> = {
    high: "border-red-800/50 bg-red-950/10",
    medium: "border-yellow-800/50 bg-yellow-950/10",
    low: "border-slate-800/50 bg-slate-900/10",
  };
  const labelColors: Record<string, string> = {
    high: "text-red-400 bg-red-900/30",
    medium: "text-yellow-400 bg-yellow-900/30",
    low: "text-slate-400 bg-slate-800/30",
  };
  return (
    <div className={`rounded-lg border p-3 ${colors[gap.priority]}`}>
      <div className="flex items-start justify-between mb-1">
        <h4 className="text-xs font-medium text-slate-200">{gap.topic}</h4>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${labelColors[gap.priority]}`}>
          {gap.priority.toUpperCase()}
        </span>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        {gap.suggestion.slice(0, 120)}{gap.suggestion.length > 120 ? "…" : ""}
      </p>
    </div>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-[10px] uppercase tracking-wider">{label}</span>
        <span className="text-slate-400">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      {sub && <p className="text-[10px] text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "brain" | "dev">("tasks");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await fetchDashboard();
      setData(d);
      setError(null);
      setLastUpdate(new Date());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    if (autoRefresh) {
      intervalRef.current = setInterval(load, 30000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load, autoRefresh]);

  const doneCount = data?.tasks.filter((t) => t.status === "done").length || 0;
  const inProgressCount = data?.tasks.filter((t) => t.status === "in_progress").length || 0;
  const pendingCount = data?.tasks.filter((t) => t.status === "pending").length || 0;

  // Group tasks by phase
  const phases = data?.tasks.reduce<Record<string, Task[]>>((acc, t) => {
    const p = t.phase || "Other";
    if (!acc[p]) acc[p] = [];
    acc[p].push(t);
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen grid-bg">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-[#2a2a3a]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white jarvis-glow">JARVIS Control Panel</h1>
                <p className="text-[10px] text-slate-500">Autonomous Development Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* System status dots */}
              <div className="hidden md:flex items-center gap-3 text-[10px] text-slate-400">
                {data?.system && (
                  <>
                    <span className="flex items-center gap-1.5"><StatusDot status={data.system.ha} />HA</span>
                    <span className="flex items-center gap-1.5"><StatusDot status={data.system.jarvis_core} />Core</span>
                    <span className="flex items-center gap-1.5"><StatusDot status={data.system.llm} />LLM</span>
                    <span className="flex items-center gap-1.5"><StatusDot status={data.system.cron_engine} />Engine</span>
                    <span className="flex items-center gap-1.5"><StatusDot status={data.system.brain_optimizer} />Brain</span>
                  </>
                )}
              </div>

              {/* Auto refresh */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`text-[10px] px-2 py-1 rounded border ${
                  autoRefresh
                    ? "border-cyan-500/30 bg-cyan-950/20 text-cyan-400"
                    : "border-slate-700 text-slate-500"
                }`}
              >
                {autoRefresh ? "Live" : "Paused"}
              </button>

              {/* Manual refresh */}
              <button
                onClick={load}
                disabled={loading}
                className="text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
              >
                <Icon.RefreshCw className={loading ? "animate-spin" : ""} />
              </button>

              {/* Last update */}
              {lastUpdate && (
                <span className="text-[10px] text-slate-600 hidden sm:block">
                  {format(lastUpdate, "HH:mm:ss")}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-950/30 border border-red-800/50 rounded-lg text-xs text-red-400">
            Error loading data: {error}
          </div>
        )}

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Tasks Done" value={doneCount} sub={`of ${data?.tasks.length || 0} total`} icon={<Icon.CheckCircle />} />
          <StatCard label="In Progress" value={inProgressCount} sub="active right now" icon={<Icon.Activity />} />
          <StatCard label="Sessions Archived" value={data?.uptime.sessions_archived || 0} sub="brain optimizer cycles" icon={<Icon.Brain />} />
          <StatCard label="Errors Logged" value={data?.uptime.errors_fixed || 0} sub="in error registry" icon={<Icon.AlertCircle />} />
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex gap-1 mb-4 border-b border-[#2a2a3a]">
          {[
            { id: "tasks" as const, label: "Task Backlog", icon: <Icon.CheckCircle /> },
            { id: "brain" as const, label: "Brain Optimizer", icon: <Icon.Brain /> },
            { id: "dev" as const, label: "Dev Engine", icon: <Icon.Terminal /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tasks Tab ── */}
        {activeTab === "tasks" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Task list — full width or left column */}
            <div className="lg:col-span-2 bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Icon.CheckCircle /> Task Backlog
                </h2>
                <div className="flex gap-2 text-[10px]">
                  <span className="text-emerald-400">{doneCount} done</span>
                  <span className="text-cyan-400">{inProgressCount} active</span>
                  <span className="text-slate-500">{pendingCount} pending</span>
                </div>
              </div>

              {loading && !data ? (
                <div className="space-y-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-8 skeleton rounded" />
                  ))}
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto pr-1">
                  {Object.entries(phases).map(([phase, tasks]) => (
                    <PhaseGroup key={phase} phase={phase} tasks={tasks} />
                  ))}
                  {Object.keys(phases).length === 0 && (
                    <p className="text-slate-500 text-xs text-center py-8">No tasks loaded</p>
                  )}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* Skill Gaps */}
              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Icon.Lightbulb /> Skill Suggestions
                  {data?.skill_gaps && data.skill_gaps.length > 0 && (
                    <span className="text-[10px] bg-yellow-900/30 text-yellow-400 px-1.5 py-0.5 rounded">
                      {data.skill_gaps.length}
                    </span>
                  )}
                </h2>
                <div className="space-y-2">
                  {data?.skill_gaps && data.skill_gaps.length > 0 ? (
                    data.skill_gaps.slice(0, 4).map((gap, i) => (
                      <SkillGapCard key={i} gap={gap} />
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-500 text-center py-4">No skill gaps detected</p>
                  )}
                </div>
                {data?.skill_gaps && data.skill_gaps.length > 4 && (
                  <p className="text-[10px] text-slate-600 mt-2 text-center">
                    +{data.skill_gaps.length - 4} more in /journal/skills/
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Icon.Zap /> Quick Actions
                </h2>
                <div className="space-y-1.5">
                  <QuickAction href="/api/trigger-jarvis" label="Run JARVIS Dev Engine" icon={<Icon.Play />} color="cyan" />
                  <QuickAction href="/api/trigger-brain" label="Run Brain Optimizer" icon={<Icon.Brain />} color="violet" />
                  <QuickAction href="/api/health" label="Check System Health" icon={<Icon.Server />} color="emerald" />
                  <QuickAction href="https://github.com/Zebratic/jarvis-core" label="Open GitHub Repo" icon={<Icon.GitBranch />} color="gray" external />
                </div>
              </div>

              {/* Help Zeb */}
              <div className="bg-gradient-to-br from-violet-950/40 to-cyan-950/40 border border-violet-800/30 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Icon.MessageSquare /> Help Needed
                </h2>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Zeb — here's where I need your input right now:
                </p>
                <div className="space-y-2">
                  {data?.skill_gaps?.filter(g => g.priority === "high").slice(0, 2).map((gap, i) => (
                    <div key={i} className="bg-black/20 rounded p-2">
                      <p className="text-[11px] font-medium text-violet-300">{gap.topic}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{gap.suggestion.slice(0, 80)}…</p>
                    </div>
                  )) || (
                    <p className="text-[11px] text-slate-500">Nothing urgent — I'll keep building</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Brain Optimizer Tab ── */}
        {activeTab === "brain" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {/* Activity Log */}
              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Icon.Activity /> Live Activity Log
                  </h2>
                  <span className="text-[10px] text-slate-500">Last 30 entries</span>
                </div>
                <div className="h-[400px] overflow-y-auto bg-[#0a0a0f] rounded-lg p-3 space-y-0.5">
                  {data?.activity && data.activity.length > 0 ? (
                    data.activity.map((entry, i) => <LogLine key={i} entry={entry} />)
                  ) : (
                    <p className="text-slate-600 text-[11px]">No activity yet</p>
                  )}
                </div>
              </div>

              {/* Errors Registry */}
              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Icon.AlertCircle /> Error Registry
                </h2>
                <div className="max-h-[200px] overflow-y-auto">
                  <p className="text-[11px] text-slate-500">
                    {data?.uptime.errors_fixed || 0} errors logged. Full registry at:<br />
                    <code className="text-cyan-400/60">/root/brain-optimizer/journal/insights/context/errors.md</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Brain Stats */}
            <div className="space-y-4">
              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Icon.Brain /> Brain Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Brain cycles run</span>
                    <span className="text-sm font-mono text-white">{data?.uptime.brain || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Sessions archived</span>
                    <span className="text-sm font-mono text-white">{data?.uptime.sessions_archived || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Errors in registry</span>
                    <span className="text-sm font-mono text-white">{data?.uptime.errors_fixed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Skill gaps found</span>
                    <span className="text-sm font-mono text-white">{data?.skill_gaps?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Icon.Sparkles /> Journal Files
                </h2>
                <div className="space-y-2 text-[11px]">
                  {[
                    { path: "/root/brain-optimizer/journal/sessions/", desc: "Session archives" },
                    { path: "/root/brain-optimizer/journal/insights/context/errors.md", desc: "Error registry" },
                    { path: "/root/brain-optimizer/journal/insights/context/patterns.md", desc: "Patterns" },
                    { path: "/root/brain-optimizer/journal/skills/_suggestions_master.md", desc: "Skill gaps" },
                    { path: "/root/brain-optimizer/journal/insights/context/todo-progress.md", desc: "TODO tracker" },
                    { path: "/root/brain-optimizer/brain.log", desc: "Activity log" },
                  ].map((f) => (
                    <div key={f.path} className="flex items-center justify-between py-1 border-b border-slate-800/30 last:border-0">
                      <span className="text-slate-400">{f.desc}</span>
                      <span className="text-slate-600 font-mono text-[10px] truncate ml-2 max-w-[160px]">{f.path}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Dev Engine Tab ── */}
        {activeTab === "dev" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {/* Recent Commits */}
              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Icon.GitCommit /> Recent Commits
                </h2>
                <div className="space-y-0">
                  {data?.commits && data.commits.length > 0 ? (
                    data.commits.slice(0, 15).map((c, i) => <CommitItem key={i} entry={c} />)
                  ) : (
                    <p className="text-[11px] text-slate-500">No commits yet</p>
                  )}
                </div>
              </div>

              {/* Project Structure */}
              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Icon.Server /> Project Structure
                </h2>
                <div className="font-mono text-[11px] text-slate-400 space-y-1">
                  <TreeLine label="jarvis-core/" indent={0} color="cyan" />
                  <TreeLine label="├── api/" indent={1} />
                  <TreeLine label="│   └── main.py (FastAPI)" indent={2} />
                  <TreeLine label="├── llm/" indent={1} />
                  <TreeLine label="│   └── base.py (providers)" indent={2} />
                  <TreeLine label="├── ha/" indent={1} />
                  <TreeLine label="│   └── client.py (HA client)" indent={2} />
                  <TreeLine label="├── voice/ (Phase 2)" indent={1} color="violet" />
                  <TreeLine label="├── skills/" indent={1} />
                  <TreeLine label="├── Dockerfile" indent={1} />
                  <TreeLine label="├── docker-compose.yml" indent={1} />
                  <TreeLine label="└── README.md" indent={1} />
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <TreeLine label="jarvis-device/ (planned)" indent={0} color="violet" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dev Stats */}
            <div className="space-y-4">
              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Icon.Zap /> Dev Engine Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Engine cycles</span>
                    <span className="text-sm font-mono text-white">{data?.uptime.jarvis || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Brain cycles</span>
                    <span className="text-sm font-mono text-violet-400">{data?.uptime.brain || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">JARVIS cron</span>
                    <span className="text-sm font-mono text-cyan-400">hourly</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Brain cron</span>
                    <span className="text-sm font-mono text-violet-400">every 6h</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Icon.Cpu /> Key Files
                </h2>
                <div className="space-y-2 text-[11px]">
                  {[
                    { label: "TODO", path: "/root/jarvis-dev/TODO.md" },
                    { label: "Roadmap", path: "/root/JARVIS_ROADMAP.md" },
                    { label: "Agent Context", path: "/root/jarvis-dev/AGENT_CONTEXT.md" },
                    { label: "Jarvis Core API", path: "/root/jarvis-dev/jarvis-core/api/main.py" },
                    { label: "LLM Layer", path: "/root/jarvis-dev/jarvis-core/llm/base.py" },
                    { label: "HA Client", path: "/root/jarvis-dev/jarvis-core/ha/client.py" },
                  ].map((f) => (
                    <div key={f.path} className="flex items-center justify-between py-1 border-b border-slate-800/30 last:border-0">
                      <span className="text-slate-400">{f.label}</span>
                      <span className="text-slate-600 font-mono text-[10px] truncate ml-2 max-w-[160px]">{f.path}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next priorities */}
              <div className="bg-[#12121a] border border-cyan-800/30 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-cyan-300 flex items-center gap-2 mb-3">
                  <Icon.TrendingUp /> Next Priorities
                </h2>
                <ol className="space-y-2 text-[11px] text-slate-400 list-decimal list-inside">
                  <li>Sessions management (SQLite)</li>
                  <li>LLM tool calling (structured output)</li>
                  <li>Rich context builder</li>
                  <li>Voice pipeline (STT/TTS)</li>
                  <li>Web dashboard UI</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function QuickAction({ href, label, icon, color, external }: {
  href: string; label: string; icon: React.ReactNode; color: string; external?: boolean;
}) {
  const colorMap: Record<string, string> = {
    cyan: "border-cyan-800/30 hover:border-cyan-600/50 text-cyan-400 hover:bg-cyan-950/20",
    violet: "border-violet-800/30 hover:border-violet-600/50 text-violet-400 hover:bg-violet-950/20",
    emerald: "border-emerald-800/30 hover:border-emerald-600/50 text-emerald-400 hover:bg-emerald-950/20",
    gray: "border-slate-700 hover:border-slate-600 text-slate-400 hover:bg-slate-900/20",
  };
  const content = (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${colorMap[color]}`}>
      {icon}
      {label}
      {external && <span className="ml-auto text-slate-600">↗</span>}
    </div>
  );
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
  }
  return <button onClick={() => fetch(href).catch(() => {})}>{content}</button>;
}

function TreeLine({ label, indent, color }: { label: string; indent: number; color?: string }) {
  const indentPad = "    ".repeat(indent);
  const textColor = color === "cyan" ? "text-cyan-400" : color === "violet" ? "text-violet-400" : "text-slate-400";
  return (
    <div className={`${indentPad}${textColor}`}>
      {indent > 0 && <span className="text-slate-700 mr-1">│</span>} {label}
    </div>
  );
}
