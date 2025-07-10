/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        accent: '#EF4444',
        surface: '#F8FAFC',
        trust: '#10B981',
        llc: '#2563EB',
        scorp: '#EF4444',
        form1040: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'dash': 'dash 2s linear infinite',
        'connection-flow': 'connection-flow 3s ease-in-out infinite',
        'trifecta-glow': 'trifecta-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        dash: {
          'to': { 'stroke-dashoffset': '-12' },
        },
        'connection-flow': {
          '0%, 100%': { strokeDashoffset: '0' },
          '50%': { strokeDashoffset: '20' },
        },
        'trifecta-glow': {
          '0%': { filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}