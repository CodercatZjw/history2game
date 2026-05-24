/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Noto Sans SC", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 18px 80px rgba(15, 23, 42, 0.28)",
      },
    },
  },
  plugins: [],
};
