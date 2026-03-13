// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ["pruvious", "@nuxtjs/i18n"],

  pruvious: {
    jwt: {
      secretKey: "rFDHHUNHwdOHLhUEBq4ooUU4ZDquKMiEQFHoqNQ2U3ERXAM8SE3GrKw-YZwZX05E"
    }
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'fr', language: 'fr-FR' }
    ],
    defaultLocale: 'en',
  }
})
