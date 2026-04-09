import { NextResponse } from "next/server";

async function checkService(url: string, opts: { timeout?: number } = {}): Promise<boolean> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), opts.timeout || 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  // Primary source: JARVIS Core health (already knows HA/llm status)
  let jarvisCoreOk = false;
  let haConnected = false;
  let llmReady = false;

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    const res = await fetch("http://localhost:8080/api/health", { signal: controller.signal });
    clearTimeout(t);
    if (res.ok) {
      const data = await res.json();
      jarvisCoreOk = true;
      haConnected = data.ha_connected ?? false;
      llmReady = data.llm_ready ?? false;
    }
  } catch {}

  // LLM proxy health as fallback (server-to-server, no CORS)
  let llmProxyOk = false;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("http://10.0.0.49:8080/health", { signal: controller.signal });
    clearTimeout(t);
    llmProxyOk = res.ok;
  } catch {}

  return NextResponse.json({
    jarvis_core: jarvisCoreOk ? "online" : "offline",
    ha: haConnected ? "online" : "offline",
    llm: (llmReady || llmProxyOk) ? "online" : "offline",
  });
}
