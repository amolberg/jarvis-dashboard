import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWAProvider } from "./components/PWAProvider";
import { InstallPrompt } from "./components/InstallPrompt";
import { OfflineBanner } from "./components/OfflineBanner";

export const metadata: Metadata = {
  title: "JARVIS Control Panel",
  description: "JARVIS AI — Voice-controlled smart home companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JARVIS",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#00d4ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-[#0a0a0f]">
          <PWAProvider>
            <InstallPrompt />
            <OfflineBanner />
            {children}
          </PWAProvider>
        </div>
      </body>
    </html>
  );
}
