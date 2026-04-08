import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jarvis: {
          bg: "#0a0a0f",
          surface: "#12121a",
          card: "#1a1a26",
          border: "#2a2a3a",
          primary: "#00d4ff",
          accent: "#7c3aed",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          text: "#e2e8f0",
          muted: "#64748b",
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #00d4ff, 0 0 10px #00d4ff" },
          "100%": { boxShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
