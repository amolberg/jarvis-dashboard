import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo") || "jarvis-core";
  const repoPath = `/root/jarvis-dev/${repo}`;

  try {
    // Get recent commits
    const log = execSync(
      `git log --oneline -20 --format="%H|%ad|%s|%D" --date=iso --no-walk=unsorted`,
      { cwd: repoPath, timeout: 5000 }
    ).toString();

    const commits = log.trim().split("\n").filter(Boolean).map((line) => {
      const [hash, date, message, refs] = line.split("|");
      return {
        hash,
        ts: date?.trim(),
        message: message?.trim(),
        refs: refs?.trim() || "",
        branch: refs?.split(",")[0]?.replace("tag: ", "")?.trim() || "main",
        status: "pushed" as const,
      };
    });

    return NextResponse.json({ commits });
  } catch (err) {
    return NextResponse.json({ commits: [], error: String(err) });
  }
}
