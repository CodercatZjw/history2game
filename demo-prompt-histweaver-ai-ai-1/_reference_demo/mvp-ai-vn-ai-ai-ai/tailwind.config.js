/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serifcn: ['"Noto Serif SC"', '"Songti SC"', "serif"],
        sanscn: ['"Noto Sans SC"', "system-ui", "sans-serif"]
      },
      boxShadow: {
        vn: "0 18px 60px rgba(0, 0, 0, 0.45)",
        glow: "0 0 28px rgba(245, 176, 86, 0.28)"
      },
      colors: {
        ink: "#17120f",
        lacquer: "#402019",
        amberline: "#f7bf72"
      }
    }
  },
  plugins: []
};
