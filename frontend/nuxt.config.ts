// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [{ src: "https://js.puter.com/v2/" }],
    },
  },
  $production: {
    routeRules: {
      "/**": { isr: true },
    },
  },
  $development: {
    runtimeConfig: {
      apiSecret: "12345",
      public: {
        apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://default.com",
      },
    },
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
  modules: ["vuetify-nuxt-module", "@nuxt/fonts", "@nuxt/image", "@pinia/nuxt"],
  //   css: ["@/app/assets/scss/variable.scss"],
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
