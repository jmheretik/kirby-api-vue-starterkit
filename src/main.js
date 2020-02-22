import Vue from 'vue'
import App from '@/App.vue'
import Router from '@/router'
import KirbyApi from '@/api/kirby'

Vue.config.productionTip = false

// self invoke async initialization
;(async () => {
  const site = await KirbyApi.get('site?select=title,children')

  // only listed pages
  site.children = site.children.filter(page => page.num)

  const router = await Router.init(site.children)

  // globals
  Vue.prototype.$api = KirbyApi
  Vue.prototype.$site = site

  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})()
