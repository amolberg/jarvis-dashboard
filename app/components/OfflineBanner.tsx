"use client";

import { usePWA } from "./PWAProvider";

export function OfflineBanner() {
  const { isOffline } = usePWA();

  if (!isOffline) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        padding: "8px 16px",
        background: "linear-gradient(90deg, #f59e0b, #d97706)",
        color: "#0a0a0f",
        textAlign: "center",
        fontSize: "13px",
        fontWeight: 600,
        zIndex: 99999,
      }}
    >
      <span style={{ marginRight: "6px" }}>📡</span>
      You are offline — showing cached data
    </div>
  );
}
