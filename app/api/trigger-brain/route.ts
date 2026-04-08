import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST() {
  try {
    const result = execSync("python3 /root/brain-optimizer/brain_optimizer.py 2>&1", {
      timeout: 60000,
      cwd: "/root/brain-optimizer",
    }).toString();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
