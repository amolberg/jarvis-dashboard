"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface SystemStatus {
  jarvis_core: "online" | "offline" | "unknown";
  ha: "online" | "offline" | "unknown";
  llm: "online" | "offline" | "unknown";
  uptime: number;
}

interface Task {
  id: string;
  content: string;
  status: "done" | "in_progress" | "pending";
  phase: string;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icon = {
  Chat: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Home: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  CheckSquare: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  Settings: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Mic: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  Brain: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  RefreshCw: ({ className = "" }: { className?: string }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
  Activity: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Server: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
  Wifi: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Bot: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/><circle cx="8" cy="16" r="1" fill="currentColor"/>
      <circle cx="16" cy="16" r="1" fill="currentColor"/>
    </svg>
  ),
  Play: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Cpu: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM5 18l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

// ─── Status Dot ──────────────────────────────────────────────────────────────

function StatusDot({ status, size = 8 }: { status: string; size?: number }) {
  const map: Record<string, { bg: string; shadow: string }> = {
    online: { bg: "bg-emerald-400", shadow: "shadow-[0_0_6px_rgba(52,211,153,0.6)]" },
    running: { bg: "bg-emerald-400", shadow: "shadow-[0_0_6px_rgba(52,211,153,0.6)]" },
    idle: { bg: "bg-yellow-400", shadow: "shadow-[0_0_6px_rgba(251,191,36,0.6)]" },
    offline: { bg: "bg-red-400", shadow: "shadow-[0_0_6px_rgba(248,113,113,0.6)]" },
    unknown: { bg: "bg-slate-500", shadow: "" },
    done: { bg: "bg-emerald-400", shadow: "shadow-[0_0_6px_rgba(52,211,153,0.6)]" },
    in_progress: { bg: "bg-cyan-400 animate-pulse", shadow: "shadow-[0_0_8px_rgba(34,211,238,0.6)]" },
    pending: { bg: "bg-slate-600", shadow: "" },
  };
  const { bg, shadow } = map[status] || map.unknown;
  return (
    <span
      className={`inline-block rounded-full ${bg} ${shadow}`}
      style={{ width: size, height: size }}
    />
  );
}

// ─── Chat Tab ────────────────────────────────────────────────────────────────

function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [jarvisOnline, setJarvisOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Check JARVIS health
  useEffect(() => {
    fetch("http://localhost:8080/api/health", { signal: AbortSignal.timeout(3000) })
      .then(r => { if (r.ok) setJarvisOnline(true); else setJarvisOnline(false); })
      .catch(() => setJarvisOnline(false));
  }, []);

  // Register PWA SW
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i]?.isFinal) {
          setIsListening(false);
        }
      }
      setInput(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || isStreaming) return;

    // Cancel any ongoing stream
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: msg,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        try {
          const parsed = JSON.parse(chunk);
          if (parsed.response) {
            fullResponse += parsed.response;
            setStreamingContent(fullResponse);
          }
        } catch {
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        }
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: fullResponse,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `Connection error: ${err.message}. Make sure JARVIS Core is running on port 8080.`,
          createdAt: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      abortRef.current = null;
    }
  }, [input, isStreaming]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopStreaming = () => {
    if (abortRef.current) abortRef.current.abort();
    setIsStreaming(false);
    setStreamingContent("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-none">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h2 className="text-base font-semibold text-white mb-1">JARVIS Online</h2>
            <p className="text-xs text-slate-500 mb-6">
              {jarvisOnline
                ? "Ready to assist. Ask me anything about your smart home, projects, or system status."
                : "JARVIS Core is offline on port 8080 — running it will connect us."}
            </p>
            {/* Quick suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {["What's the status of my smart home?", "Run the Brain Optimizer", "What errors have been logged?", "Show me recent commits"].map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-950/10 transition-all active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-cyan-600 text-white rounded-br-sm"
                  : "bg-[#12121a] border border-[#2a2a3a] text-slate-200 rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
                    <Icon.Bot /> JARVIS
                  </span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p
                className={`text-[10px] mt-1.5 ${
                  msg.role === "user" ? "text-cyan-200/60" : "text-slate-600"
                }`}
              >
                {format(msg.createdAt, "HH:mm")}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming bubble */}
        {isStreaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3 bg-[#12121a] border border-[#2a2a3a]">
              <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">{streamingContent}</p>
              <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 mt-1 rounded" />
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isStreaming && !streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3 bg-[#12121a] border border-[#2a2a3a]">
              <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      {isStreaming ? (
        <div className="px-4 py-3">
          <button
            onClick={stopStreaming}
            className="w-full py-3 rounded-2xl bg-red-950/30 border border-red-800/40 text-red-400 text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12"/>
            </svg>
            Stop
          </button>
        </div>
      ) : (
        <div className="px-4 py-3">
          <div className="flex items-end gap-2 bg-[#12121a] border border-[#2a2a3a] rounded-2xl px-3 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message JARVIS..."
              rows={1}
              className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 resize-none outline-none max-h-32 py-1 leading-relaxed"
              style={{ scrollbarWidth: "none" }}
            />
            {/* Mic button */}
            <button
              onClick={toggleListening}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                isListening
                  ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              <Icon.Mic />
            </button>
            {/* Send button */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                input.trim()
                  ? "bg-cyan-500 text-black"
                  : "bg-slate-800 text-slate-600"
              }`}
            >
              <Icon.Send />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({ onRefresh, lastUpdate, loading }: { onRefresh: () => void; lastUpdate: Date | null; loading: boolean }) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [triggering, setTriggering] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [jc, ha, llm] = await Promise.all([
      fetch("http://localhost:8080/api/health", { signal: AbortSignal.timeout(3000) }).then(r => r.ok ? "online" : "offline").catch(() => "offline" as const),
      fetch("http://10.0.0.7:8123/api/", { signal: AbortSignal.timeout(3000) }).then(r => r.ok ? "online" : "offline").catch(() => "offline" as const),
      fetch("http://10.0.0.49:8080/health", { signal: AbortSignal.timeout(3000) }).then(r => r.ok ? "online" : "offline").catch(() => "offline" as const),
    ]);
    setSystemStatus({ jarvis_core: jc, ha, llm, uptime: 0 });

    // Load tasks from TODO.md
    try {
      const res = await fetch("/api/read?path=" + encodeURIComponent("/root/jarvis-dev/TODO.md"));
      if (res.ok) {
        const text = await res.text();
        const parsed: Task[] = [];
        let currentPhase = "";
        for (const line of text.split("\n")) {
          if (line.startsWith("## ")) currentPhase = line.replace("## ", "");
          if (line.match(/^- \[[x \>]?\]/)) {
            const done = line.includes("[x]");
            const inProg = line.includes("[>]");
            const content = line.replace(/^-\s?\[[x \>]?\]/, "").trim().slice(0, 70);
            parsed.push({
              id: content.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40),
              content,
              status: done ? "done" : inProg ? "in_progress" : "pending",
              phase: currentPhase,
            });
          }
        }
        setTasks(parsed);
      }
    } catch {}
  };

  const triggerAction = async (id: string, endpoint: string, label: string) => {
    setTriggering(id);
    try {
      await fetch(endpoint, { method: "POST" });
    } catch {}
    setTimeout(() => setTriggering(null), 3000);
  };

  const doneCount = tasks.filter(t => t.status === "done").length;
  const inProgCount = tasks.filter(t => t.status === "in_progress").length;

  return (
    <div className="px-4 py-4 space-y-4 overflow-y-auto flex-1">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white">JARVIS</h1>
          <p className="text-[11px] text-slate-500">
            {lastUpdate ? `Updated ${format(lastUpdate, "HH:mm")}` : "Loading..."}
          </p>
        </div>
        <button
          onClick={() => { onRefresh(); loadData(); }}
          disabled={loading}
          className="w-9 h-9 rounded-xl border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-50 active:scale-95 transition-all"
        >
          <Icon.RefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* System Status Grid */}
      <div>
        <h2 className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 font-medium">System Status</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "jarvis_core", label: "Core", sub: "Port 8080", icon: <Icon.Cpu /> },
            { key: "ha", label: "Home Asst", sub: "10.0.0.7", icon: <Icon.Server /> },
            { key: "llm", label: "LLM Proxy", sub: "10.0.0.49", icon: <Icon.Zap /> },
          ].map(({ key, label, sub, icon }) => {
            const rawStatus = systemStatus?.[key as keyof SystemStatus];
            const status: string = typeof rawStatus === "number" ? "unknown" : (rawStatus || "unknown");
            return (
              <div key={key} className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1.5 text-slate-400">{icon}</div>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <StatusDot status={status} />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{status}</span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium">{label}</p>
                <p className="text-[9px] text-slate-600">{sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 font-medium">Quick Actions</h2>
        <div className="space-y-1.5">
          {[
            { id: "jarvis", endpoint: "/api/trigger-jarvis", label: "Run Dev Engine", sub: "Process tasks & push commits", color: "cyan" },
            { id: "brain", endpoint: "/api/trigger-brain", label: "Run Brain Optimizer", sub: "Analyze & improve", color: "violet" },
            { id: "health", endpoint: "/api/health", label: "System Health Check", sub: "Check all services", color: "emerald" },
          ].map(({ id, endpoint, label, sub, color }) => (
            <button
              key={id}
              onClick={() => triggerAction(id, endpoint, label)}
              disabled={!!triggering}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                color === "cyan"
                  ? "border-cyan-900/40 bg-cyan-950/10 hover:bg-cyan-950/20 text-cyan-400"
                  : color === "violet"
                  ? "border-violet-900/40 bg-violet-950/10 hover:bg-violet-950/20 text-violet-400"
                  : "border-emerald-900/40 bg-emerald-950/10 hover:bg-emerald-950/20 text-emerald-400"
              }`}
            >
              <span className={color === "cyan" ? "text-cyan-400" : color === "violet" ? "text-violet-400" : "text-emerald-400"}>
                <Icon.Sparkles />
              </span>
              <div className="flex-1 text-left">
                <p className="text-[13px] font-medium">
                  {triggering === id ? "Running..." : label}
                </p>
                <p className="text-[10px] opacity-60">{sub}</p>
              </div>
              {triggering === id ? (
                <Icon.RefreshCw className="animate-spin" />
              ) : (
                <Icon.ChevronRight />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Task Progress */}
      <div>
        <h2 className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 font-medium">Task Progress</h2>
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-white font-medium">{doneCount}/{tasks.length}</span>
            <span className="text-[10px] text-slate-500">
              {inProgCount > 0 && <span className="text-cyan-400 mr-2">{inProgCount} active</span>}
              {doneCount} done
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: tasks.length > 0 ? `${(doneCount / tasks.length) * 100}%` : "0%",
                background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
              }}
            />
          </div>
          {tasks.filter(t => t.status === "pending").slice(0, 3).map(t => (
            <div key={t.id} className="flex items-center gap-2 mt-2 py-1.5 border-t border-slate-800/50">
              <StatusDot status="pending" size={6} />
              <span className="text-[12px] text-slate-400 truncate">{t.content}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scenes & Macros */}
      <ScenesSection />
    </div>
  );
}

// ─── Scenes Section ────────────────────────────────────────────────────────────

interface SceneEntity {
  entity_id: string;
  friendly_name: string;
  domain: "scene" | "automation" | "script";
  state: string;
}

function ScenesSection() {
  const [entities, setEntities] = useState<SceneEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [lastTriggered, setLastTriggered] = useState<string | null>(null);

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    setLoading(true);
    try {
      const [scenes, automations, scripts] = await Promise.all([
        fetch("http://localhost:8080/api/devices?domain=scene").then(r => r.json()).catch(() => ({ entities: [] })),
        fetch("http://localhost:8080/api/devices?domain=automation").then(r => r.json()).catch(() => ({ entities: [] })),
        fetch("http://localhost:8080/api/devices?domain=script").then(r => r.json()).catch(() => ({ entities: [] })),
      ]);
      const all: SceneEntity[] = [
        ...(scenes.entities || []),
        ...(automations.entities || []),
        ...(scripts.entities || []),
      ].map(e => ({
        entity_id: e.entity_id,
        friendly_name: e.attributes?.friendly_name || e.friendly_name || e.entity_id,
        domain: e.domain,
        state: e.state,
      })).filter(e => e.friendly_name && e.friendly_name !== e.entity_id);
      setEntities(all);
    } catch {}
    setLoading(false);
  };

  const trigger = async (entity: SceneEntity) => {
    setTriggering(entity.entity_id);
    try {
      const res = await fetch(`http://localhost:8080/api/devices/${entity.entity_id}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "turn_on" }),
      });
      if (res.ok) {
        setLastTriggered(entity.entity_id);
        setTimeout(() => setLastTriggered(null), 3000);
      }
    } catch {}
    setTriggering(null);
  };

  const domainColor = (domain: string) =>
    domain === "scene" ? "amber" : domain === "automation" ? "violet" : "emerald";

  const domainIcon = (domain: string) => {
    if (domain === "scene") return "🎬";
    if (domain === "automation") return "⚡";
    return "📜";
  };

  const grouped = entities.reduce<Record<string, SceneEntity[]>>((acc, e) => {
    const name = e.friendly_name;
    const parts = name.split(/\s+/);
    let group = "Other";
    if (name.toLowerCase().includes("blomgreen")) group = "Blomgreen";
    else if (name.toLowerCase().includes("stue") || name.toLowerCase().includes("living")) group = "Stue";
    else if (name.toLowerCase().includes("kokken") || name.toLowerCase().includes("kitchen")) group = "Kokken";
    else if (name.toLowerCase().includes("alex")) group = "Alex";
    else if (name.toLowerCase().includes("gang") || name.toLowerCase().includes("hall")) group = "Gang";
    else if (name.toLowerCase().includes("toilet") || name.toLowerCase().includes("bath")) group = "Toilet";
    else if (name.toLowerCase().includes("all") || name.toLowerCase().includes("alt")) group = "All Rooms";
    else if (name.toLowerCase().includes("movie") || name.toLowerCase().includes("film")) group = "Movie";
    else if (name.toLowerCase().includes("night") || name.toLowerCase().includes("nightlight")) group = "Nightlight";
    else if (name.toLowerCase().includes("read") || name.toLowerCase().includes("lys")) group = "Reading";
    else if (name.toLowerCase().includes("rainbow") || name.toLowerCase().includes("color")) group = "Color";
    else if (name.toLowerCase().includes("morning") || name.toLowerCase().includes("morgen")) group = "Morning";
    else if (name.toLowerCase().includes("evening") || name.toLowerCase().includes("aften")) group = "Evening";
    else if (name.toLowerCase().includes("camera")) group = "Camera";
    else if (name.toLowerCase().includes("heat") || name.toLowerCase().includes("varm")) group = "Climate";
    if (!acc[group]) acc[group] = [];
    acc[group].push(e);
    return acc;
  }, {});

  const domainBg = (domain: string) => {
    if (domain === "scene") return "bg-amber-500/10 border-amber-500/20";
    if (domain === "automation") return "bg-violet-500/10 border-violet-500/20";
    return "bg-emerald-500/10 border-emerald-500/20";
  };

  const domainText = (domain: string) => {
    if (domain === "scene") return "text-amber-400";
    if (domain === "automation") return "text-violet-400";
    return "text-emerald-400";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Scenes & Macros</h2>
        <button
          onClick={loadEntities}
          disabled={loading}
          className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 disabled:opacity-50"
        >
          {loading ? "..." : "↻"} {entities.length}
        </button>
      </div>
      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-16 bg-[#12121a] border border-[#2a2a3a] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <p className="text-[10px] text-slate-600 mb-1.5 uppercase tracking-wider">{group}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {items.slice(0, 8).map(entity => {
                  const isTriggering = triggering === entity.entity_id;
                  const isTriggered = lastTriggered === entity.entity_id;
                  return (
                    <button
                      key={entity.entity_id}
                      onClick={() => trigger(entity)}
                      disabled={!!triggering}
                      className={`
                        relative flex flex-col items-start px-3 py-2.5 rounded-xl border text-left
                        transition-all active:scale-[0.97] overflow-hidden
                        ${domainBg(entity.domain)}
                        ${isTriggered ? "ring-1 ring-white/20" : ""}
                        ${isTriggering ? "opacity-60" : ""}
                      `}
                    >
                      <span className={`text-[10px] font-mono ${domainText(entity.domain)} opacity-60`}>
                        {domainIcon(entity.domain)}
                      </span>
                      <span className="text-[12px] text-white font-medium leading-tight mt-0.5 line-clamp-2">
                        {entity.friendly_name.replace(new RegExp(`^(${group}\\s*[-:]*\\s*|${group}\\s+)`,"i"), "")}
                      </span>
                      {isTriggering && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                          <span className="w-3 h-3 border border-white/60 border-t-transparent rounded-full animate-spin" />
                        </span>
                      )}
                      {isTriggered && !isTriggering && (
                        <span className="absolute top-1 right-1 text-[8px] text-white/80">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tasks Tab ────────────────────────────────────────────────────────────────

function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "done" | "pending">("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetch("/api/read?path=" + encodeURIComponent("/root/jarvis-dev/TODO.md"));
      if (res.ok) {
        const text = await res.text();
        const parsed: Task[] = [];
        let currentPhase = "";
        for (const line of text.split("\n")) {
          if (line.startsWith("## ")) currentPhase = line.replace("## ", "");
          if (line.match(/^- \[[x \>]?\]/)) {
            const done = line.includes("[x]");
            const inProg = line.includes("[>]");
            const content = line.replace(/^-\s?\[[x \>]?\]/, "").trim();
            parsed.push({
              id: content.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40),
              content,
              status: done ? "done" : inProg ? "in_progress" : "pending",
              phase: currentPhase,
            });
          }
        }
        setTasks(parsed);
      }
    } catch {}
    setLoading(false);
  };

  const phases = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    const p = t.phase || "Other";
    if (!acc[p]) acc[p] = [];
    acc[p].push(t);
    return acc;
  }, {});

  const filteredTasks = filter === "all" ? tasks : tasks.filter(t => {
    if (filter === "done") return t.status === "done";
    if (filter === "pending") return t.status !== "done";
    return true;
  });

  const doneCount = tasks.filter(t => t.status === "done").length;
  const inProgCount = tasks.filter(t => t.status === "in_progress").length;

  return (
    <div className="px-4 py-4 flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-bold text-white">Tasks</h1>
          <p className="text-[11px] text-slate-500">{tasks.length} total · {doneCount} done</p>
        </div>
        <button
          onClick={loadTasks}
          className="w-9 h-9 rounded-xl border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all"
        >
          <Icon.RefreshCw />
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 mb-4">
        {[
          { id: "all" as const, label: `All ${tasks.length}` },
          { id: "pending" as const, label: `Pending ${tasks.length - doneCount}` },
          { id: "done" as const, label: `Done ${doneCount}` },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === f.id
                ? "bg-cyan-500 text-black"
                : "bg-[#12121a] border border-[#2a2a3a] text-slate-400"
            }`}
          >
            {f.label}
          </button>
        ))}
        {inProgCount > 0 && (
          <span className="text-[11px] px-3 py-1.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 flex items-center gap-1">
            <StatusDot status="in_progress" />
            {inProgCount} active
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl p-3">
        <div className="flex justify-between text-[11px] mb-1.5">
          <span className="text-slate-400">Overall progress</span>
          <span className="text-white font-medium">
            {tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: tasks.length > 0 ? `${(doneCount / tasks.length) * 100}%` : "0%",
              background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
            }}
          />
        </div>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 bg-[#12121a] border border-[#2a2a3a] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(phases).map(([phase, phaseTasks]) => {
            const filtered = phaseTasks.filter(t => {
              if (filter === "done") return t.status === "done";
              if (filter === "pending") return t.status !== "done";
              return true;
            });
            if (filtered.length === 0) return null;
            const phaseDone = filtered.filter(t => t.status === "done").length;

            return (
              <div key={phase}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">{phase}</h3>
                  <span className="text-[10px] text-slate-600">{phaseDone}/{filtered.length}</span>
                </div>
                <div className="space-y-1.5">
                  {filtered.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                        task.status === "done"
                          ? "bg-emerald-950/5 border-emerald-900/20"
                          : task.status === "in_progress"
                          ? "bg-cyan-950/10 border-cyan-900/30"
                          : "bg-[#12121a] border-[#2a2a3a]"
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        <StatusDot status={task.status} size={8} />
                      </div>
                      <p className={`text-[13px] leading-relaxed flex-1 ${
                        task.status === "done" ? "text-slate-600 line-through" : "text-slate-200"
                      }`}>
                        {task.content}
                      </p>
                      {task.status === "in_progress" && (
                        <span className="text-[9px] bg-cyan-950/30 text-cyan-400 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              No tasks in this filter
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const [jarvisOnline, setJarvisOnline] = useState(false);
  const [haOnline, setHaOnline] = useState(false);
  const [llmOnline, setLlmOnline] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/health", { signal: AbortSignal.timeout(3000) }).then(r => r.ok).catch(() => false),
      fetch("http://10.0.0.7:8123/api/", { signal: AbortSignal.timeout(3000) }).then(r => r.ok).catch(() => false),
      fetch("http://10.0.0.49:8080/health", { signal: AbortSignal.timeout(3000) }).then(r => r.ok).catch(() => false),
    ]).then(([jc, ha, llm]) => {
      setJarvisOnline(jc);
      setHaOnline(ha);
      setLlmOnline(llm);
    });
  }, []);

  return (
    <div className="px-4 py-4 flex-1 overflow-y-auto space-y-4">
      <h1 className="text-base font-bold text-white">Settings</h1>

      {/* Service Endpoints */}
      <div>
        <h2 className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 font-medium">Service Endpoints</h2>
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl overflow-hidden">
          {[
            { label: "JARVIS Core", sub: "localhost:8080", status: jarvisOnline },
            { label: "Home Assistant", sub: "10.0.0.7:8123", status: haOnline },
            { label: "LLM Proxy", sub: "10.0.0.49:8080", status: llmOnline },
          ].map(({ label, sub, status }, i, arr) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < arr.length - 1 ? "border-b border-[#2a2a3a]/50" : ""
              }`}
            >
              <StatusDot status={status ? "online" : "offline"} />
              <div className="flex-1">
                <p className="text-[13px] text-white font-medium">{label}</p>
                <p className="text-[10px] text-slate-600">{sub}</p>
              </div>
              <span className={`text-[10px] font-medium ${
                status ? "text-emerald-400" : "text-red-400"
              }`}>
                {status ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div>
        <h2 className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 font-medium">About</h2>
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl overflow-hidden divide-y divide-[#2a2a3a]/50">
          {[
            { label: "App", value: "JARVIS Control Panel" },
            { label: "Version", value: "1.0.0" },
            { label: "PWA", value: "Enabled" },
            { label: "Speech", value: "Web Speech API" },
            { label: "Speech Speed", value: "1.0x" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[12px] text-slate-400">{label}</span>
              <span className="text-[12px] text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* External Links */}
      <div>
        <h2 className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 font-medium">Links</h2>
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl overflow-hidden">
          {[
            { label: "Home Assistant", href: "http://10.0.0.7:8123" },
            { label: "LLM Proxy Admin", href: "http://10.0.0.49:3001" },
            { label: "GitHub (jarvis-core)", href: "https://github.com/amolberg/jarvis-core" },
            { label: "Brain Optimizer", href: "file:///root/brain-optimizer" },
          ].map(({ label, href }, i, arr) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between px-4 py-3 text-[13px] text-slate-300 hover:text-white hover:bg-[#1a1a26] transition-colors ${
                i < arr.length - 1 ? "border-b border-[#2a2a3a]/50" : ""
              }`}
            >
              <span>{label}</span>
              <Icon.ChevronRight />
            </a>
          ))}
        </div>
      </div>

      {/* PWA install hint */}
      <div className="bg-gradient-to-r from-cyan-950/20 to-violet-950/20 border border-cyan-800/20 rounded-xl p-4">
        <p className="text-[12px] text-slate-300 mb-1 font-medium">Install as App</p>
        <p className="text-[11px] text-slate-500">Add to home screen for full-screen, app-like experience with offline support.</p>
      </div>
    </div>
  );
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────

type Tab = "chat" | "home" | "tasks" | "settings";

function BottomTabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs = [
    { id: "chat" as const, label: "Chat", icon: Icon.Chat },
    { id: "home" as const, label: "Home", icon: Icon.Home },
    { id: "tasks" as const, label: "Tasks", icon: Icon.CheckSquare },
    { id: "settings" as const, label: "Settings", icon: Icon.Settings },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="flex items-center justify-around bg-[#0a0a0f]/95 backdrop-blur-md border-t border-[#2a2a3a] px-2 py-2">
        {tabs.map(({ id, label, icon: IconComp }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-xl transition-all flex-1 ${
                isActive
                  ? "text-cyan-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <IconComp />
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar({ jarvisOnline }: { jarvisOnline: boolean }) {
  return (
    <div
      className="sticky top-0 z-40 px-4 py-3 backdrop-blur-md"
      style={{ background: "rgba(10,10,15,0.9)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">J</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-white jarvis-glow truncate">JARVIS</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#12121a] border border-[#2a2a3a] rounded-full px-3 py-1">
          <StatusDot status={jarvisOnline ? "online" : "offline"} />
          <span className="text-[10px] text-slate-400 font-medium">
            {jarvisOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function JarvisDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [jarvisOnline, setJarvisOnline] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/health", { signal: AbortSignal.timeout(3000) })
      .then(r => setJarvisOnline(r.ok))
      .catch(() => setJarvisOnline(false));
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setLastUpdate(new Date());
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Top bar — only show on non-chat tabs */}
      {activeTab !== "chat" && (
        <TopBar jarvisOnline={jarvisOnline} />
      )}

      {/* Content area — scrollable */}
      <div className="flex-1 overflow-y-auto content-pad-bottom">
        {activeTab === "chat" && <ChatTab />}
        {activeTab === "home" && (
          <HomeTab onRefresh={handleRefresh} lastUpdate={lastUpdate} loading={loading} />
        )}
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>

      {/* Bottom tab bar */}
      <BottomTabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
