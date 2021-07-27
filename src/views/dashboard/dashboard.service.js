import Vue from 'vue'

export function overview (body, teacherId) {
  const url = `${process.env.VUE_APP_SERVER_URL}/score/chart/overview/${teacherId}`
  return Vue.httpfire.post(url, body)
}

export function singleTest (body, teacherId) {
  const url = `${process.env.VUE_APP_SERVER_URL}/score/chart/single/test/${teacherId}`
  return Vue.httpfire.post(url, body)
}

export function singleStudentTest (body, teacherId) {
  const url = `${process.env.VUE_APP_SERVER_URL}/score/chart/single/student/test/${teacherId}`
  return Vue.httpfire.post(url, body)
}

export function testsAverageStudent (body, teacherId) {
  const url = `${process.env.VUE_APP_SERVER_URL}/score/chart/tests/average/${teacherId}`
  return Vue.httpfire.post(url, body)
}
