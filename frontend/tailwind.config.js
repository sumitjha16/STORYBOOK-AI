/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bronze: {
          400: '#CD7F32',
        },
        gryffindor: {
          primary: '#740001',
          secondary: '#D3A625',
        },
        slytherin: {
          primary: '#1A472A',
          secondary: '#2A623D',
        },
        ravenclaw: {
          primary: '#0E1A40',
          secondary: '#946B2D',
        },
        hufflepuff: {
          primary: '#ECB939',
          secondary: '#F0C75E',
        },
      },
      backgroundImage: {
        'gryffindor': "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80')",
        'slytherin': "url('https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&q=80')",
        'ravenclaw': "url('https://images.unsplash.com/photo-1516571748831-5d81767b788d?auto=format&fit=crop&q=80')",
        'hufflepuff': "url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80')",
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(100%)' },
          '50%': { filter: 'brightness(120%)' },
        },
      },
    },
  },
  plugins: [],
};