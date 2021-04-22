export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // SSR: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-ssr
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Daniel Shervheim',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'Daniel Shervheim' },
      { name: 'msapplication-TileImage', content: '/icon.png' },
      { name: 'msapplication-TileColor', content: '#2b5fdf' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'apple-touch-icon', href: '/icon.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/node_modules/destyle.css/destyle.css',
    // '~/node_modules/github-markdown-css/github-markdown.css',
    '~/assets/github-markdown.css',
    '~/assets/slide-fade.css',
    '~/assets/styles.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/vue-masonry-css.js',
      ssr: false
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content'
  ],

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    liveEdit: false,

    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css'
      },

      // https://github.com/nuxt/content/issues/102
      remarkPlugins: [
        'remark-math'
      ],
      rehypePlugins: [
        'rehype-katex'
      ]
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  // Transitions: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-transition/
  layoutTransition: {
    name: 'slide-fade',
    mode: 'out-in'
  },

  pageTransition: {
    name: 'slide-fade',
    mode: 'out-in'
  },

  generate: {
    // False, since we define our own 404.html that github pages will use.
    fallback: false
  }
}
