/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F48024',
        secondary: '#0A0A0B',
        accent: '#FFA500',
        success: '#5FA637',
        warning: '#F1B24A',
        error: '#D1383D',
        info: '#0077CC',
        surface: '#FFFFFF',
        background: '#F8F9F9',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}