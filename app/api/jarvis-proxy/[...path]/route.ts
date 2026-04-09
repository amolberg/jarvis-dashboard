import { NextRequest, NextResponse } from "next/server";

const JARVIS_CORE = "http://localhost:8080/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${JARVIS_CORE}/${path.join("/")}${request.nextUrl.search}`;
  const res = await fetch(url, {
    headers: { ...Object.fromEntries(request.headers.entries()) },
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${JARVIS_CORE}/${path.join("/")}`;
  const body = await request.text();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("Content-Type") || "application/json",
    },
    body,
    signal: AbortSignal.timeout(60000),
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}
