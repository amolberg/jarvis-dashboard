import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { existsSync } from "fs";

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    services: {
      jarvis_core: await checkHttp("http://localhost:8080/api/health"),
      home_assistant: await checkHttp("http://10.0.0.7:8123/api/", { timeout: 3000 }),
      llm_proxy: await checkHttp("http://10.0.0.49:8080/health", { timeout: 3000 }),
      openclaw: true, // if we're here, we are
    },
    files: {
      brain_optimizer: existsSync("/root/brain-optimizer/brain_optimizer.py"),
      jarvis_core: existsSync("/root/jarvis-dev/jarvis-core/api/main.py"),
      todo_md: existsSync("/root/jarvis-dev/TODO.md"),
      roadmap: existsSync("/root/JARVIS_ROADMAP.md"),
    },
    cron: {
      jarvis_engine: existsSync("/root/.hermes/cron/jobs/ec203f5708f9.json"),
      brain_optimizer: existsSync("/root/.hermes/cron/jobs/61f706c2090a.json"),
    },
  };

  return NextResponse.json(checks);
}

async function checkHttp(url: string, opts: { timeout?: number } = {}): Promise<boolean> {
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
