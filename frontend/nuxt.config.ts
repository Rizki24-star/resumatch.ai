// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: "vercel",
  },
  app: {
    head: {
      script: [{ src: "https://js.puter.com/v2/" }],
    },
  },
  modules: [
    "vuetify-nuxt-module",
    "@nuxt/fonts",
    "@nuxt/image",
    "@pinia/nuxt",
    "@sidebase/nuxt-auth",
  ],
  runtimeConfig: {
    apiSecret: process.env.AUTH_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
    },
    authSecret: process.env.AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    baseURL: "/api/auth",
    provider: {
      type: "authjs",
    },
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
    },
  },
  $development: {
    typescript: {
      strict: true,
      typeCheck: false,
    },
  },
  $env: {
    $staging: {},
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vuetify: {
    moduleOptions: {},
  },
  fonts: {
    families: [
      {
        name: "Inter",
        provider: "google",
        weights: [400, 500, 600, 700, 800],
        display: "swap",
      },
    ],
  },
});
