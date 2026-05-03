/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        display: ['Cormorant Garamond', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      colors: {
        night: '#0d1117',
        midnight: '#161b26',
        panel: '#1e2736',
        gold: '#c9a84c',
        'gold-light': '#e8c97e',
        'gold-dim': '#8a6e2f',
        jade: '#2a6b5a',
        'jade-light': '#3d9b84',
        muted: '#8892a4',
        soft: '#c4cad6',
      }
    }
  },
  plugins: []
}
