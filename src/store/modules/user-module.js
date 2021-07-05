import md5 from 'js-md5'
import { Base64 } from 'js-base64'
import { isEmpty, isNull } from '../../utils/index'
import { login } from '../../views/login/login.service'

const userModule = {
  state: {
    userInfo: {},
    accessToken: ''
  },

  getters: {
    userInfo: state => {
      if (!isNull(state.userInfo)) {
        const userInfo = Base64.decode(state.userInfo)
        return JSON.parse(userInfo)
      } else {
        let userInfo = localStorage.getItem('UserInfo')
        userInfo = Base64.decode(userInfo)
        return isEmpty(userInfo) ? null : JSON.parse(userInfo)
      }
    },
    accessToken: state => {
      if (!isNull(state.accessToken)) {
        return state.accessToken
      } else {
        const accessToken = localStorage.getItem('AccessToken')
        return isEmpty(accessToken) ? '' : accessToken
      }
    }
  },

  mutations: {
    setUserInfo (state, payload) {
      state.userInfo = payload
    },
    setAccessToken (state, accessToken) {
      state.accessToken = accessToken
    },
    resetUserInfo (state) {
      state.userInfo = {}
      localStorage.removeItem('UserInfo')
    }
  },

  actions: {
    login ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const { userName, password } = payload
        login(userName, md5(password)).then(res => {
          commit('setUserInfo', res)
          commit('setAccessToken', res)

          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    logout ({ commit }, payload) {
      // 可以调用api注销服务端登录
    },
    resetUserInfo ({ commit }) {
      commit('resetUserInfo')
    }
  }
}

export default userModule
