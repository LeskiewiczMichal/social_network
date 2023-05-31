/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-lighter': 'var(--primary-lighter)',
        'background-white': 'var(--background-white)',
        'background-dark': 'var(--background-dark)',
        'gray-dark': 'var(--text-gray-dark)',
      },
    },
  },
  plugins: [],
};
