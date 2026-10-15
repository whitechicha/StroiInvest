import { env } from 'node:process'
const baseURL = env.NUXT_APP_BASE_URL || '/'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: { port: 2355 },
  vite: {
    server: { allowedHosts: ['strojinvest.cloudpub.ru'] },
  },
  css: ['~/assets/css/main.css'],
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [{ name: 'theme-color', content: '#193a32' }],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: `${baseURL.replace(/\/$/, '')}/assets/favicon.svg`,
        },
      ],
    },
  },
  runtimeConfig: {
    dadataApiKey: '',
    public: { whatsappPhone: '79889984896', siteUrl: '' },
  },
  nitro: { prerender: { routes: ['/'] } },
})
