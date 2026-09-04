import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#2f8fff',
          600: '#1a6ff2',
          700: '#1558d6',
          800: '#1747a8',
          900: '#183f84',
        },
        risk: {
          critical: '#dc2626',
          high: '#ea580c',
          moderate: '#ca8a04',
          low: '#2563eb',
          none: '#16a34a',
          unknown: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        pulseSlow: 'pulseSlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
