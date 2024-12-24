/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Hurricane: ["Hurricane", "sans-serif"],
        Pacifico: ["Pacifico", "sans-serif"],
        Lexend: ["Lexend", "sans-serif"],
      },
      animation: {
        likeButton: "like 0.5s ease-in-out",
      },

      keyframes: {
        like: {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.2)" },
          "50%": { transform: "sacle(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
