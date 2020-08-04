const php = require('node-php-server')
import kirby from '../kirby.config'
import KirbyApi from './plugins/kirby-api'

const isProd = process.env.NODE_ENV === 'production'
const isStatic = process.env.NODE_ENV === 'static'

// merge mode specific .env config file
Object.entries(require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` }).parsed || {}).forEach(([key, value]) => (process.env[key] = value))

// head attributes that need to be rendered server-side (e.g. Open Graph or Twitter meta tags)
const ssrHeadAttrs = { title: null, meta: [], __dangerouslyDisableSanitizers: [] }

if (isProd && kirby.inject) {
  // PHP and Kirby is available
  ssrHeadAttrs.title = '<?= $site->title() . " | " . $page->title() ?>'

  // please read https://vue-meta.nuxtjs.org/api/#dangerouslydisablesanitizers
  ssrHeadAttrs.__dangerouslyDisableSanitizers.push('title')
}

if (!isProd && kirby.serve) kirby.start(php)

export default async () => {
  const api = KirbyApi.init(process.env.NUXT_ENV_KIRBY_URL)
  const site = await api.getSite()

  return {
    mode: 'spa',
    target: isStatic ? 'static' : 'server',
    router: {
      base: process.env.NUXT_ENV_BASE_URL
    },
    env: {
      isStatic,
      ...(isStatic ? { site } : {})
    },
    build: {
      publicPath: isProd && kirby.inject ? kirby.assetsDir : '/_nuxt/'
    },
    generate: {
      ...(isStatic
        ? {
            routes: site.routes.map(route => '/' + route),
            fallback: '404.html'
          }
        : {
            exclude: [/.*/],
            fallback: 'index.html'
          })
    },
    head: {
      htmlAttrs: { lang: 'en' },
      title: ssrHeadAttrs.title,
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }, ...ssrHeadAttrs.meta],
      link: [{ rel: 'icon', href: process.env.NUXT_ENV_BASE_URL + 'favicon.ico' }],
      __dangerouslyDisableSanitizers: ssrHeadAttrs.__dangerouslyDisableSanitizers
    },
    plugins: ['plugins/kirby-api-client'],
    modules: ['@nuxtjs/proxy'],
    buildModules: [
      '@nuxtjs/eslint-module',
      ...(isStatic ? ['modules/kirby-scraper'] : []),
      ...(isProd && kirby.inject ? ['modules/kirby-inject'] : [])
    ],
    proxy: {
      '**/*.json': {
        target: process.env.NUXT_ENV_KIRBY_URL,
        pathRewrite: { [process.env.NUXT_ENV_BASE_URL]: '/' }
      }
    },
    hooks: {
      generate: {
        done: () => {
          if (!isProd && kirby.serve) kirby.stop(php)
        }
      }
    }
  }
}
