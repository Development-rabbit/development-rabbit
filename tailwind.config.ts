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
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        accent: {
          DEFAULT: "#2e4bef",
          purple: "#2e4bef",
          blue: "#3b5bff",
          deep: "#1c26a8",
          light: "#eaeefc",
        },
        surface: "var(--surface)",
        "surface-light": "var(--surface-light)",
        line: "#e5e8f4",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-instrument-sans)", "system-ui", "sans-serif"],
        instrument: ["var(--font-instrument-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "accent-panel":
          "linear-gradient(165deg, #8a97ff 0%, #4a5cf0 38%, #2e3ecf 68%, #1c26a8 100%)",
        "hero-glow":
          "radial-gradient(circle at 50% 0%, rgba(46,75,239,0.10), transparent 45%), radial-gradient(circle at 80% 30%, rgba(111,141,255,0.10), transparent 35%), radial-gradient(circle at 20% 40%, rgba(46,75,239,0.08), transparent 35%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        pulseGlow: "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
