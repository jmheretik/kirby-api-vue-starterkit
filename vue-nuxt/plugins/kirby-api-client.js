import KirbyApi from './kirby-api'
import modifyPageHtml from './modify-page-html'

const apiUrl =
  process.env.NODE_ENV !== 'development' ? process.env.NUXT_ENV_KIRBY_URL : window.location.origin + process.env.NUXT_ENV_BASE_URL.slice(0, -1)

const api = KirbyApi.init(apiUrl)

// overload original api methods
const apiGetSite = api.getSite
const apiGetPage = api.getPage

api.getSite = async () => {
  return await (!process.env.isStatic ? apiGetSite() : require(`../tmp/home.json`).site)
}

api.getPage = async id => {
  // TODO remove once full static generation is supported (https://github.com/nuxt/rfcs/issues/22)
  const page = await (!process.env.isStatic ? apiGetPage(id) : require(`../tmp/${id}.json`))

  if (!process.env.isStatic) {
    modifyPageHtml(page, document, html => {
      // fix relative links
      for (const a of html.getElementsByTagName('a')) {
        a.href = a.href.replace(process.env.NUXT_ENV_KIRBY_URL, process.env.NUXT_ENV_BASE_URL.slice(0, -1))
      }
    })
  }

  return page
}

export default async ({ app }, inject) => {
  inject('api', api)
  inject('site', await api.getSite())
}
