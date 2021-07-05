import axios from 'axios'
import store from '../store'
import router from '../router/index'
import { isEmpty } from '../utils/index'
import { message } from 'ant-design-vue'

export default {

  install (Vue, options) {
    axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
    axios.defaults.timeout = 60000

    axios.interceptors.request.use(config => {
      const accessToken = localStorage.getItem('AccessToken')
      if (!isEmpty(accessToken)) {
        // eslint-disable-next-line dot-notation
        config.headers['Authorization'] = accessToken
      }
      config.headers['Content-Type'] = 'application/json; charset=UTF-8'

      return config
    }, error => {
      console.error(error)
      message.error('您的登录信息已失效，请重新登录！')

      return Promise.reject(error)
    })

    const errMsg = '服务器异常，请联系Kuo！'

    axios.interceptors.response.use(response => {
      const code = response.status
      if (code >= 200 && code <= 206) {
        const data = response.data
        if (data.success) {
          return data.data || data
        } else {
          if (data.code === 401) {
            if (router.currentRoute.name !== 'Login') {
              store.commit('resetUserInfo')
              message.error('您的登录信息已失效，请重新登录！')
              router.push({ name: 'Login' })
            } else {
              message.error(data.message || errMsg)
            }
          } else {
            message.error(data.message || errMsg)
          }
          return Promise.reject(data.message || errMsg)
        }
      }
      return response
    }, error => {
      if (!error.response) {
        message.error(errMsg)

        return Promise.reject(error)
      }
      if (!this.isInvalidToken(error.response)) {
        store.commit('resetUserInfo')
        message.error('您的登录信息已失效，请重新登录！')
        router.push({ name: 'Login' })
      }
      if (error.response.status >= 500) {
        message.error('服务器异常，请稍后再试！')
        return Promise.reject(error)
      } else if (error.response.status === 401) {
        return Promise.reject(error)
      } else {
        const resp = error.response.data
        message.error((resp.path + ' : ' + resp.error) || errMsg)

        return Promise.reject(error)
      }
    })

    Vue.prototype.$httpfire = Vue.httpfire = this
  },

  isInvalidToken (response) {
    const status = response.status
    const error = response.statusText || response.data.error
    return (status === 401 && (error === 'Unauthorized' || error === 'invalid_token' || error === 'expired_token'))
  },

  // async refreshToken (response) {
  //   const userInfo = JSON.parse(localStorage.getItem('UserInfo'))
  //   const refreshToken = userInfo.refresh_token
  //   if (isEmpty(refreshToken)) {
  //     return Promise.reject(response)
  //   }
  //   const payload = {
  //     appId: Constant.APP_ID,
  //     appKey: Constant.APP_KEY,
  //     refreshToken
  //   }
  //   const url = `${process.env.VUE_APP_STATISTICS_URL}/auth/token/refresh`
  //   try {
  //     const resp = await axios.post(url, payload)
  //     if (!isNull(resp) && !isEmpty(resp.access_token)) {
  //       this.storeToken(resp)
  //     } else {
  //       store.commit('resetUserInfo')
  //       message.error('您的登录信息已失效，请重新登录！')
  //       router.push({ name: 'Login' })
  //     }
  //     return await axios.request(response.config)
  //   } catch (err) {
  //     store.commit('resetUserInfo')
  //     message.error('您的登录信息已失效，请重新登录！')
  //     router.push({ name: 'Login' })
  //   }
  // },

  // storeToken (response) {
  //   store.commit('setUserInfo', response)
  // },

  /**
   * Http Get
   * @param {string} url request url
   * @param {object} config headers config
   */
  get (url, config) {
    return axios.get(url, config)
  },

  /**
   * Http Post
   * @param {string} url request url
   * @param {object} data request body data
   * @param {object} config headers config
   */
  post (url, data, config) {
    return axios.post(url, data, config)
  }
}
