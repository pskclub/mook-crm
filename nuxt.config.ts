// https://nuxt.com/docs/api/configuration/nuxt-config
import { SITE } from './constants/site'

export default defineNuxtConfig({
  css: ['@/assets/styles/main.scss'],
  modules: ['@finema/core', '@nuxtjs/google-fonts', '@nuxtjs/supabase'],
  core: {
    securityDisabled: true,
  },
  ssr: false,
  colorMode: {
    preference: 'light',
  },
  supabase: {
    url: SITE.BASE_API,
    key: SITE.API_KEY,
  },
  app: {
    head: {
      title: SITE.TITLE,
    },
  },
  googleFonts: {
    families: {
      'Noto Sans Thai': [400, 500, 600, 700],
      'Noto Sans Thai Looped': [400, 500, 600, 700],
    },
    display: 'swap',
  },
  compatibilityDate: '2024-08-07',
})
