"use client";

import { useEffect, useState } from "react";
import { usePWA } from "./PWAProvider";

export function InstallPrompt() {
  const { deferredPrompt, setDeferredPrompt, isInstalled, setIsInstalled } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("jarvis-install-dismissed");
    if (dismissed === "1") setDismissed(true);
  }, []);

  if (isInstalled || dismissed || !deferredPrompt) return null;

  const handleInstall = async () => {
    try {
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
    } catch (err) {
      console.error("Install prompt error:", err);
    }
    setDeferredPrompt(null);
    sessionStorage.setItem("jarvis-install-dismissed", "1");
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("jarvis-install-dismissed", "1");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "12px 16px",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
        borderTop: "1px solid rgba(0, 212, 255, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        zIndex: 9999,
        animation: "slideUp 0.3s ease",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#00d4ff", fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>
          Install JARVIS
        </div>
        <div style={{ color: "#6b7280", fontSize: "12px" }}>
          Add to home screen for full-screen experience
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={handleDismiss}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "#6b7280",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Not now
        </button>
        <button
          onClick={handleInstall}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#00d4ff",
            color: "#0a0a0f",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Install
        </button>
      </div>
    </div>
  );
}
