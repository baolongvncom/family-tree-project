import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    'pinia-plugin-persistedstate/nuxt',
    "@pinia/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:4000', // Base URL API
    }
  },

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  vuetify: {
    moduleOptions: {
      labs: true,
    }
  }
})
