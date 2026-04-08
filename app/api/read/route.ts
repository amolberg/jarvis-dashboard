import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 });
  }

  // Security: only allow paths under /root
  if (!filePath.startsWith("/root/")) {
    return NextResponse.json({ error: "Path must be under /root/" }, { status: 403 });
  }

  try {
    const content = await readFile(filePath, "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 404 });
  }
}
