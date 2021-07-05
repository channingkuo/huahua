import Vue from 'vue'

export function login (username, password) {
  const url = `${process.env.VUE_APP_SERVER_URL}/auth/login`
  return Vue.httpfire.post(url, { username, password })
}
