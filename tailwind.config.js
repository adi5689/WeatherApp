/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'custom': "url('https://i.postimg.cc/g2s4TYMs/thunderstorm-3440450-1280.jpg')",
      }),
      scrollbar: (theme) => ({
        DEFAULT: {
          'scrollbar-width': 'thin',
          'scrollbar-color': theme('colors.gray.500') + ' ' + theme('colors.gray.100'),
        },
      }),
    },
  },
  variants: {
    extend: {
      scrollbar: ['dark'],
    },
  },
  plugins: [require('tailwind-scrollbar')],
}

