import Vue from 'vue'

export function getClassList (body) {
  const url = `${process.env.VUE_APP_SERVER_URL}/class/list`
  return Vue.httpfire.post(url, body)
}

export function deleteClass (classId) {
  const url = `${process.env.VUE_APP_SERVER_URL}/class/delete/${classId}`
  return Vue.httpfire.post(url)
}

export function saveClass (body) {
  const url = `${process.env.VUE_APP_SERVER_URL}/class/save`
  return Vue.httpfire.post(url, body)
}

export function classStudentList (classId, name) {
  const url = `${process.env.VUE_APP_SERVER_URL}/class/student/list/${classId}/${name}`
  return Vue.httpfire.post(url)
}
