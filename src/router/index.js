import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Redirect',
    component: () => import(/* webpackChunkName: "layout" */ '../views/layout/layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: { title: '仪表盘' },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/dashboard.vue')
      },
      {
        path: 'term/student',
        name: 'Term',
        meta: { title: '学期学生' },
        component: () => import(/* webpackChunkName: "term" */ '../views/term/term.vue')
      },
      {
        path: 'teacher/student/score',
        name: 'TeacherStudentScore',
        meta: { title: '学生成绩' },
        component: () => import(/* webpackChunkName: "score" */ '../views/score/score.vue')
      },
      {
        path: 'student',
        name: 'Student',
        meta: { title: '学生名单' },
        component: () => import(/* webpackChunkName: "student" */ '../views/student/student.vue')
      },
      {
        path: 'class',
        name: 'Class',
        meta: { title: '班级列表' },
        component: () => import(/* webpackChunkName: "class" */ '../views/class/class.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import(/* webpackChunkName: "login" */ '../views/login/login.vue')
  },
  {
    path: '/404',
    name: 'NotFund',
    meta: { title: '404' },
    component: () => import(/* webpackChunkName: "404" */ '../views/40x/404.vue')
  }
]

const router = new VueRouter({
  // mode: 'hash',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes
})

export default router
