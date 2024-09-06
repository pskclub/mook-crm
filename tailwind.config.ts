import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    'app.vue',
    'error.vue',
    './components/**/*.{js,vue,ts}',
    './features/**/*.{js,vue,ts}',
    './containers/**/*.{js,vue,ts}',
    './layouts/**/*.{js,vue,ts}',
    './pages/**/*.{js,vue,ts}',
    './error.{js,vue,ts}',
    './utils/**/*.{js,vue,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Noto Sans Thai', 'sans-serif'],
        noto: ['Noto Sans Thai', 'sans-serif'],
      },
      colors: {
        main: {
          DEFAULT: '#2A669F',
          50: '#9CC1E5',
          100: '#8CB7E1',
          200: '#6BA3D8',
          300: '#4B8FCF',
          400: '#337BBF',
          500: '#2A669F',
          600: '#1E4A73',
          700: '#132D46',
          800: '#07111A',
          900: '#000000',
          950: '#000000',
        },
      },
    },
  },
}
