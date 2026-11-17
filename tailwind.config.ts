import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#02040a",
          navy: "#060c1e",
          deep: "#0a122c",
          surface: "#0d1633",
          blue: "#0066ff",
          cyan: "#00f0ff",
          purple: "#8b5cf6",
          violet: "#6366f1",
          silver: "#e2e8f0",
          accent: "#38bdf8",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        display: ["var(--font-space)", "sans-serif"],
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -3px rgba(0, 240, 255, 0.45)",
        "glow-blue": "0 0 35px -5px rgba(0, 102, 255, 0.55)",
        "glow-purple": "0 0 30px -4px rgba(139, 92, 246, 0.45)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.55)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
