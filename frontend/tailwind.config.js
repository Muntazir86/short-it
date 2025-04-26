/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3366FF',
        secondary: '#00CC99',
        accent: '#FF6B6B',
        neutral: {
          dark: '#333333',
          mid: '#9CA3AF',
          light: '#F3F4F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': '2rem',      // 32px
        'h2': '1.5rem',    // 24px
        'h3': '1.25rem',   // 20px
        'body': '1rem',    // 16px
        'small': '0.875rem' // 14px
      },
      lineHeight: {
        'heading': '1.2',
        'body': '1.5',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      boxShadow: {
        'card': '0px 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

