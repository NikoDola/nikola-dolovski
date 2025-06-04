import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],  safelist: [
    ...['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 
        'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 
        'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
      .flatMap(color => [
        `bg-${color}-50`,
        `bg-${color}-100`,
        `bg-${color}-200`,
        `bg-${color}-300`,
        `bg-${color}-400`,
        `bg-${color}-500`,
        `bg-${color}-600`,
        `bg-${color}-700`,
        `bg-${color}-800`,
        `bg-${color}-900`,
        `text-${color}-900` // Optional: if you need text colors too
      ])
  ],
  
  theme: {
    spacing: {
      0: "var(--space-0)",
      1: "var(--space-1)",
      2: "var(--space-2)",
      3: "var(--space-3)",
      4: "var(--space-4)",
      5: "var(--space-5)",
      6: "var(--space-6)",
      7: "var(--space-7)",
      8: "var(--space-8)",
      9: "var(--space-9)",
      10: "var(--space-10)",
      11: "var(--space-11)",
      12: "var(--space-12)",
      13: "var(--space-13)",
      14: "var(--space-14)",
      15: "var(--space-15)",
      16: "var(--space-16)",
      17: "var(--space-17)",
      18: "var(--space-18)",
      19: "var(--space-19)",
      20: "var(--space-20)",
      21: "var(--space-21)",
      22: "var(--space-22)",
      23: "var(--space-23)",
      24: "var(--space-24)",
      25: "var(--space-25)",
      26: "var(--space-26)",
      27: "var(--space-27)",
      28: "var(--space-28)",
      29: "var(--space-29)",
      30: "var(--space-30)",
      31: "var(--space-31)",
      32: "var(--space-32)",
      33: "var(--space-33)",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
