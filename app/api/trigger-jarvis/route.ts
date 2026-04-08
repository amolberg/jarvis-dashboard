import { NextResponse } from "next/server";
import { execSync } from "child_process";

// Trigger the JARVIS Development Engine cron job
export async function POST() {
  try {
    const result = execSync(
      'python3 -c "from hermes_agent.cron.jobs import trigger_job; trigger_job(\"ec203f5708f9\")"',
      { timeout: 10000, cwd: "/root/.hermes" }
    ).toString();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
