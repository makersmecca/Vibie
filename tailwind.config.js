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
    },
  },
  plugins: [],
};
