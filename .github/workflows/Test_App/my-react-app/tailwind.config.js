module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure tsx is included!
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0a1128',
        mint: '#3fe0b0',
        aqua: '#2ec4b6',
        purple: '#6c63ff',
        'gradient-dark': '#0a1128',
        'gradient-mid': '#2d3142',
        'gradient-light': '#3fe0b0',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(120deg, #0a1128 0%, #2d3142 60%, #3fe0b0 100%)',
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}