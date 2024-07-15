/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'right': '4px 0px 6px -1px rgba(0, 0, 0, 0.1), 2px 0px 4px -1px rgba(0, 0, 0, 0.06)',
        'left': '-4px 0px 6px -1px rgba(0, 0, 0, 0.1), -2px 0px 4px -1px rgba(0, 0, 0, 0.06)',
        'top': '0px -4px 6px -1px rgba(0, 0, 0, 0.1), 0px -2px 4px -1px rgba(0, 0, 0, 0.06)',
        'bottom': '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        rotate: { 
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
      },
      animation: {
        'spin-continuous': 'rotate 2s linear infinite',
      },
      colors: {
        'zinc-875': '#19191c',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
