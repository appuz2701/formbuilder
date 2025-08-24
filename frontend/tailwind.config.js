/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef6f6',
          100: '#fdeaea',
          200: '#f9cfcf',
          300: '#f4a8a8',
          400: '#ef7c7c',
          500: '#e74c3c',   // main primary (soft red-coral)
          600: '#c93b2d',
          700: '#a12f24',
          800: '#78241a',
          900: '#4d160f'
        },
        accent: {
          50: '#f2fcf9',
          100: '#d2f7eb',
          200: '#a4eed7',
          300: '#6de1c1',
          400: '#3acfa8',
          500: '#10b981',   // teal-green accent
          600: '#0d9468',
          700: '#0a7050',
          800: '#064e38',
          900: '#022e22'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        }
      },
      spacing: {
        '18': '4.5rem',
        '20': '5rem',
        '88': '22rem',
        '96': '24rem',
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0,0,0,0.05)',
        'medium': '0 8px 20px rgba(0,0,0,0.08)',
        'strong': '0 16px 40px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        'slide-down': 'slideDown 0.35s ease-out forwards',
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      }
    },
  },
  plugins: [],
}
