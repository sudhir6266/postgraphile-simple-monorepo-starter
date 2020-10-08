import colors from 'vuetify/es5/util/colors'
import bodyParser from 'body-parser'

const httpEndpoint =
  (process.env.API_HTTP_URL || 'http://localhost:3002') + '/graphql'
const websocketEndpoint =
  (process.env.API_WS_URL || 'ws://localhost:3002') + '/graphql'
const serverHttpEndpoint = 'http://nginx:9002' + '/graphql'

export default {
  mode: 'universal',
  target: 'server',
  head: {
    titleTemplate: '%s - Admin panel',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  env: {
    httpEndpoint,
    websocketEndpoint,
    serverHttpEndpoint,
  },
  css: ['~/assets/style.scss'],
  plugins: [],
  components: true,
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],
  modules: ['@nuxtjs/apollo', '@nuxtjs/proxy'],
  apollo: {
    clientConfigs: {
      default: '~/apollo/apollo-client.config.js',
    },
    errorHandler: '~/apollo/apollo-error-handler.js',
    authenticationType: 'Bearer',
    cookieAttributes: {
      expires: 7,
      path: '/',
      secure: process.env.APP_ENV === 'prod',
    },
  },
  proxy:
    process.env.NODE_ENV !== 'production'
      ? {
          '/graphql': {
            target: process.env.API_HTTP_URL || 'http://localhost:3002',
            ws: false,
          },
        }
      : {},
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.amber.base,
          accent: colors.amber.accent3,
          secondary: colors.purple.accent1,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.amber.base,
          accent: colors.amber.accent3,
          secondary: colors.purple.accent1,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
      options: {},
    },
    treeShaking: true,
    defaultAssets: {
      font: {
        family: 'Roboto',
      },
      icons: 'mdi',
    },
  },
  serverMiddleware: [bodyParser.json()],
  cssSourceMap: process.env.NODE_ENV !== 'production',
  build: {},
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
}
