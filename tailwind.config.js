/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {},
    colors: {
      ...require('tailwindcss/colors'),

      'pure-black': {
        DEFAULT: '#000000',
      },
      'pure-white': {
        DEFAULT: '#ffffff',
      },

      'black': {
        DEFAULT: '#080a0f',
        light: '#090b11',
      },

      'dark': {
        DEFAULT: '#0c0e14',
        light: '#10131b',
      },

      'gray': {
        DEFAULT: '#545a64',
        light: '#8c94a5',
      },

      'white': {
        DEFAULT: '#fcfcfc',
        light: '#e6e6e6',
      },

      'primary': {
        dark: '#BE0E2E',
        DEFAULT: '#E41138',
        light: '#EF2E52',
      },
    },
  },
  plugins: [],
}

