import Vue from 'vue'

export function uploadScore (scoreList) {
  const url = `${process.env.VUE_APP_SERVER_URL}/score/upload`
  return Vue.httpfire.post(url, scoreList)
}

export function getScoreList (body) {
  const url = `${process.env.VUE_APP_SERVER_URL}/score/list`
  return Vue.httpfire.post(url, body)
}

export function saveScore (body) {
  const url = `${process.env.VUE_APP_SERVER_URL}/score/save/single`
  return Vue.httpfire.post(url, body)
}
