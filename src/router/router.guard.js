import router from './index'
import store from '../store/index'
import { isEmpty } from '../utils/index'

// can access without accessToken
const whiteList = ['/login', '/clock']

router.beforeEach((to, from, next) => {
  document.title = isEmpty(to.meta.title) ? '花花' : `花花 - ${to.meta.title}`

  if (isEmpty(store.getters.accessToken)) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // redirect to login page
      // push redirect page after login
      next(`/login?redirect=${to.fullPath}`)
    }
  } else {
    // accessToken valid push dashboard page automatically
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  }
})
