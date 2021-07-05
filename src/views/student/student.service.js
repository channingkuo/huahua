import Vue from 'vue'

export function getStudentList (body) {
  const url = `${process.env.VUE_APP_SERVER_URL}/student/list`
  return Vue.httpfire.post(url, body)
}

export function deleteStudent (studentId) {
  const url = `${process.env.VUE_APP_SERVER_URL}/student/delete/${studentId}`
  return Vue.httpfire.post(url)
}

export function uploadStudents (studentList) {
  const url = `${process.env.VUE_APP_SERVER_URL}/student/upload`
  return Vue.httpfire.post(url, studentList)
}

export function saveStudent (student) {
  const url = `${process.env.VUE_APP_SERVER_URL}/student/save`
  return Vue.httpfire.post(url, student)
}
