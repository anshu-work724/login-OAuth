/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        fadeIn: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.18', transform: 'scale(1)' },
          '50%': { opacity: '0.32', transform: 'scale(1.06)' }
        }
      }
    }
  },
  plugins: []
};
