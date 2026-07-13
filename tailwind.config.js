/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#2563EB",
        page: "#F7F8FA",
        panel: "#FFFFFF",
        border: "#E5E7EB",
        ink: "#111827",
        muted: "#6B7280",
        savings: "#16A34A",
      },
    },
  },
  plugins: [],
};
