/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",  // 🔹 Добавляем pages
    "./src/**/*.{js,ts,jsx,tsx}",    // 🔹 Добавляем src, если нужно
    "./public/**/*.html",            // 🔹 Если есть кастомные HTML
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
