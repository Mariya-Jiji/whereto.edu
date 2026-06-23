import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          primary: "#1E2A4A",
          light: "#2E3F6E",
          muted: "#3D4F7A",
        },
        amber: {
          accent: "#E8A33D",
          light: "#F5C26B",
          pale: "#FBF0DC",
        },
        background: "#FAF8F4",
        slate: {
          body: "#4A5268",
          light: "#6B7280",
          border: "#D1D5DB",
        },
        green: {
          placement: "#5B8C6E",
          light: "#7AAF91",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F3EF",
        },
      },
      fontFamily: {
        lora: ["var(--font-lora)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "Menlo", "monospace"],
      },
      fontSize: {
        "display-lg": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading": ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.005em" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.4" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.65" }],
        "body": ["0.9375rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        "caption": ["0.8125rem", { lineHeight: "1.5" }],
        "mono-lg": ["1rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "mono": ["0.9375rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "mono-sm": ["0.8125rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        "card": "0.75rem",
        "pill": "9999px",
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(30, 42, 74, 0.06), 0 1px 2px -1px rgba(30, 42, 74, 0.04)",
        "card-hover": "0 4px 12px 0 rgba(30, 42, 74, 0.10), 0 2px 4px -1px rgba(30, 42, 74, 0.06)",
        "tray": "0 -4px 24px 0 rgba(30, 42, 74, 0.14), 0 -1px 4px 0 rgba(30, 42, 74, 0.08)",
        "elevated": "0 8px 24px 0 rgba(30, 42, 74, 0.12), 0 2px 8px -1px rgba(30, 42, 74, 0.08)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out both",
        "slide-up": "slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "skeleton": "skeleton-pulse 1.5s ease-in-out infinite",
        "scale-in": "scale-in 0.2s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
