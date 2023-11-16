import type { Config } from 'tailwindcss'
const colors = require('tailwindcss/colors')

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        stargaze: { DEFAULT: '#6c8dff', 80: '#6c8dff' },
        dark: { DEFAULT: '#06090B' },
        gray: { DEFAULT: '#A9A9A9' },
        'dark-gray': { DEFAULT: '#191D20' },
        purple: { DEFAULT: '#7E5DFF' },

        neutral: colors.neutral,
        plumbus: {
          DEFAULT: '#6c8dff',
          light: '#2859a880',
          matte: '#5D89E9',
          dark: '#FFC900',
          10: '#FFF0ED',
          20: '#5D89E9',
          30: '#F5A7A2',
          40: '#6c8dff',
          50: '#6c8dff',
          60: '#6c8dff',
          70: '#AB5152',
          80: '#944144',
          90: '#7D3136',
          100: '#662027',
          110: '#4F1019',
          120: '#38000B',
        },
        twitter: { DEFAULT: '#1DA1F2' },
      },
    },
  },
  plugins: [],
}
export default config
