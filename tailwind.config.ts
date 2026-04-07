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
        ink:       '#1C1B18',
        'ink-mid': '#4E4D48',
        'ink-light': '#96958E',
        cream:     '#F4F1EA',
        'cream-d': '#EAE6DC',
        'cream-dd':'#DDD9CE',
        white:     '#FDFCF9',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
      },
      maxWidth: {
        form: '780px',
      },
    },
  },
  plugins: [],
}

export default config
