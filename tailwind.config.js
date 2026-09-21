/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FDFCF9',
          100: '#FAF8F3',
          200: '#F3EFE6',
          300: '#E5DCce',
          400: '#C7B89F',
          500: '#9C886B',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FEF9C3',
          400: '#FBBF24',
          500: '#D97706',
          600: '#B45309',
        },
        uae: {
          navy: '#0B132B',
          slate: '#1E293B',
          emerald: '#059669',
          crimson: '#E11D48',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        'card-hover': '0 8px 20px -4px rgba(15, 23, 42, 0.08), 0 2px 6px 0 rgba(15, 23, 42, 0.04)',
        'sheet': '0 -10px 30px -5px rgba(15, 23, 42, 0.12)',
        'float': '0 12px 32px -4px rgba(15, 23, 42, 0.14)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
