// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@pinia/nuxt',
    '@nuxt/fonts',
  ],
  app: {
    head: {
      title: 'FASCO | Modern Fashion, Clothing & Accessories',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'description',
          content:
            'Shop FASCO for modern clothing, shoes and accessories. Explore curated collections, new arrivals and timeless everyday essentials.',
        },
        {
          name: 'theme-color',
          content: '#ffffff',
        },
        {
          name: 'format-detection',
          content: 'telephone=no',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
    },
  },

  css: ['~/assets/scss/main.scss'],

  runtimeConfig: {
    public: {
      // Override with NUXT_PUBLIC_API_BASE in .env (see .env.example).
      apiBase: 'https://dummyjson.com',
    },
  },

  devtools: { enabled: false },
  compatibilityDate: '2024-04-03',
})
