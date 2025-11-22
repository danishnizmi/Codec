import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'cyber': ['"Share Tech Mono"', 'monospace'],
        'heading': ['"Rajdhani"', 'sans-serif'],
      },
      colors: {
        // CYBERPUNK 2077 THEME
        'cyber-void': '#020205',    // Deep Void Black background
        'cyber-dark': '#0a0a0f',    // Slightly lighter black
        'cyber-cyan': '#00f3ff',    // Neon Cyan accent
        'cyber-pink': '#ff00ff',    // Neon Pink/Magenta
        'cyber-green': '#39FF14',   // Neon Green
        'cyber-blue': '#00d4ff',    // Neon Blue
        'cyber-purple': '#9d00ff',  // Neon Purple
        'cyber-alert': '#ff2a2a',   // Alert Red
        'cyber-yellow': '#ffd700',  // Yellow accent
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'glitch': 'glitch 0.5s ease-in-out',
        'scanlines': 'scanlines 8s linear infinite',
        'flicker': 'flicker 3s linear infinite',
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
            boxShadow: '0 0 20px rgba(0, 243, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 243, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.5)',
          },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        scanlines: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0.8' },
          '43%': { opacity: '1' },
          '45.99%': { opacity: '1' },
          '46%': { opacity: '0.8' },
          '46.5%': { opacity: '1' },
        },
      },
      boxShadow: {
        'cyber-cyan': '0 0 20px rgba(0, 243, 255, 0.6), 0 0 40px rgba(0, 243, 255, 0.3)',
        'cyber-pink': '0 0 20px rgba(255, 0, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.3)',
        'cyber-alert': '0 0 20px rgba(255, 42, 42, 0.6), 0 0 40px rgba(255, 42, 42, 0.3)',
        'cyber-green': '0 0 20px rgba(57, 255, 20, 0.6), 0 0 40px rgba(57, 255, 20, 0.3)',
        'cyber-glow': '0 0 30px rgba(0, 243, 255, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
