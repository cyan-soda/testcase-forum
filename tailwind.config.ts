import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      SourceSansPro: ["--var(font-source-sans-pro)"],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        green: "#B9FF66",
        black: "#191A23",
        grey: "#F3F3F3",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
} satisfies Config;
