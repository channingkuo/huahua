import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/libs/reset.css'
import './style/tailwind.css'

import './router/router.guard'

import './ant-design-vue'

import httpfire from './plugins/httpfire'
Vue.use(httpfire)

Vue.config.productionTip = process.env.NODE_ENV === 'production'

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
