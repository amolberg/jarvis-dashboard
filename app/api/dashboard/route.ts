import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const dataPath = "/root/brain-optimizer/dashboard_data.json";
  if (existsSync(dataPath)) {
    try {
      const content = readFileSync(dataPath, "utf-8");
      return NextResponse.json(JSON.parse(content));
    } catch {}
  }
  return NextResponse.json({ updated_at: null, sessions_total: 0, skill_gaps: [] });
}
