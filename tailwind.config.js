/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0F62FE',
          600: '#0d56e8',
          700: '#0b4ad1',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#54B399',
          600: '#4ba085',
          700: '#3d8470',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#F1C21B',
          600: '#d4aa17',
          700: '#b89214',
        },
        surface: '#F4F7FB',
        success: '#24A148',
        warning: '#F1C21B',
        error: '#DA1E28',
        info: '#0043CE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}