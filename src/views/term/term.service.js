import Vue from 'vue'

export function getList (body) {
  const url = `${process.env.VUE_APP_SERVER_URL}/teacher/term/student/list`
  return Vue.httpfire.post(url, body)
}

export function getClassList (teacherId, term) {
  const url = `${process.env.VUE_APP_SERVER_URL}/teacher/term/class/list/${teacherId}/${term}`
  return Vue.httpfire.post(url)
}

export function toggleTeacherTerm (termId) {
  const url = `${process.env.VUE_APP_SERVER_URL}/teacher/term/toggle/${termId}`
  return Vue.httpfire.post(url)
}

export function newTeacherTerm (body) {
  const url = `${process.env.VUE_APP_SERVER_URL}/teacher/term/new`
  return Vue.httpfire.post(url, body)
}

export function deleteTeacherTerm (termId) {
  const url = `${process.env.VUE_APP_SERVER_URL}/teacher/term/delete/${termId}`
  return Vue.httpfire.post(url)
}

export function saveTeacherTerm (body) {
  const url = `${process.env.VUE_APP_SERVER_URL}/teacher/term/save`
  return Vue.httpfire.post(url, body)
}
