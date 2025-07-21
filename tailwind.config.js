/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        neural: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      backgroundImage: {
        'neural-gradient': 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 35%, rgba(6, 182, 212, 0.1) 100%)',
        'ai-pattern': 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
        'dark-neural': 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 35%, rgba(6, 182, 212, 0.05) 100%)',
        'gradient-shift': 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)',
        'gradient-shift-hover': 'linear-gradient(45deg, #1d4ed8, #6d28d9, #0891b2, #059669)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ai-pulse': 'ai-pulse 2s ease-in-out infinite',
        'neural-flow': 'neural-flow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'color-wave': 'color-wave 1.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
        },
        'ai-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)',
            transform: 'scale(1.05)'
          },
        },
        'neural-flow': {
          '0%, 100%': { 
            background: 'linear-gradient(90deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)'
          },
          '50%': { 
            background: 'linear-gradient(90deg, rgba(147,51,234,0.1) 0%, rgba(6,182,212,0.1) 100%)'
          },
        },
        'gradient-shift': {
          '0%, 100%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'shimmer': {
          '0%': {
            'background-position': '-200% 0'
          },
          '100%': {
            'background-position': '200% 0'
          }
        },
        'color-wave': {
          '0%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          },
          '100%': {
            'background-position': '0% 50%'
          }
        }
      },
      backgroundSize: {
        '300%': '300%',
        '400%': '400%',
      },
      boxShadow: {
        'ai': '0 0 20px rgba(59, 130, 246, 0.3)',
        'ai-hover': '0 0 30px rgba(59, 130, 246, 0.5)',
        'neural': '0 4px 20px rgba(59, 130, 246, 0.1), 0 0 40px rgba(147, 51, 234, 0.1)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.6)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.6)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.6)',
      }
    },
  },
  plugins: [],
};