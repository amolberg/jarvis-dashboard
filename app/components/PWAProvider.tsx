"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface PWAContextValue {
  deferredPrompt: Event | null;
  setDeferredPrompt: (e: Event | null) => void;
  isOffline: boolean;
  isInstalled: boolean;
  setIsInstalled: (v: boolean) => void;
}

const PWAContext = createContext<PWAContextValue>({
  deferredPrompt: null,
  setDeferredPrompt: () => {},
  isOffline: false,
  isInstalled: false,
  setIsInstalled: () => {},
});

export function PWAProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // beforeinstallprompt — Android/Chrome
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Offline detection
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    setIsOffline(!navigator.onLine);

    // Detect if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <PWAContext.Provider
      value={{
        deferredPrompt,
        setDeferredPrompt,
        isOffline,
        isInstalled,
        setIsInstalled,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  return useContext(PWAContext);
}
