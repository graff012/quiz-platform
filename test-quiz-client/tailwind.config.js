/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        card: '#1a1a1a',
        'card-hover': '#262626',
        border: '#333333',
        primary: '#3b82f6',
        'primary-hover': '#2563eb',
      },
    },
  },
  plugins: [],
}
