export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'ngo_front_end',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/scss/theme/buefy_custom.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/buefy.js',
    '~/plugins/axios.js',
    '~/plugins/calendar.js',
    '~/plugins/updateDB.js',
    '~/plugins/i18n.js',
    '~/plugins/database.js', // must be below updateDB plugin
    '~/plugins/tour.js',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/localforage',
    '@nuxtjs/svg',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    ['nuxt-buefy', { css: false, materialDesignIcons: true }],
    '@nuxtjs/style-resources',
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    terser: {
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },

  styleResources: {
    scss: ['./scss/utils/variable.scss'],
  },
  pwa: {
    manifest: {
      start_url: '/',
      theme_color: '#ffbc57',
    },
  },
  axios: {
    baseURL: process.env.API_url,
  },

  ssr: false,
}
