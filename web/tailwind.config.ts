import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CYBERPUNK THEME - Deep Space Dark
        'cyber-dark': {
          900: '#0A0E1A', // Deep Space Black
          800: '#0F1419', // Midnight Dark
          700: '#161B22', // Dark Slate Container
          600: '#1C2128', // Elevated Surface
          500: '#22272E', // Card Background
        },
        // Electric Cyan Primary
        primary: {
          50: '#E0FEFF',
          100: '#B3FCFF',
          200: '#66F9FF',
          300: '#1AF5FF',
          400: '#00EEFF',
          500: '#00FFFF', // Electric Cyan
          600: '#00DADA',
          700: '#00B8B8',
          800: '#009696',
          900: '#007474',
        },
        // Vibrant Fuchsia Secondary
        secondary: {
          50: '#FFE6FF',
          100: '#FFCCFF',
          200: '#FF99FF',
          300: '#FF66FF',
          400: '#FF33FF',
          500: '#FF00FF', // Vibrant Fuchsia/Magenta
          600: '#D900D9',
          700: '#B300B3',
          800: '#8D008D',
          900: '#670067',
        },
        // Neon Green Accent
        accent: {
          50: '#E6FFE6',
          100: '#CCFFCC',
          200: '#99FF99',
          300: '#66FF66',
          400: '#4DFF4D',
          500: '#39FF14', // Neon Green
          600: '#2EC810',
          700: '#24A00D',
          800: '#1A780A',
          900: '#105007',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
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
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.5)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 0 10px rgba(255, 255, 255, 0.05)',
        'glow': '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.2)',
        'glow-lg': '0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.8)',
        'glow-fuchsia': '0 0 20px rgba(255, 0, 255, 0.8)',
        'glow-green': '0 0 20px rgba(57, 255, 20, 0.8)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
