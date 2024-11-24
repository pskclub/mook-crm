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
          DEFAULT: '#3C7770',
          50: '#9DCDC8',
          100: '#8FC7C0',
          200: '#74B9B1',
          300: '#59ABA2',
          400: '#499289',
          500: '#3C7770',
          600: '#376D66',
          700: '#32625D',
          800: '#2C5853',
          900: '#274E49',
          950: '#254945',
        },
      },
    },
  },
}
