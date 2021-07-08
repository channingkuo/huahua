const optionsModule = {
  state: {
    menuList: [
      {
        key: '0',
        title: '仪表盘',
        icon: 'dashboard',
        path: '/dashboard'
      },
      {
        key: '1',
        title: '学生成绩',
        icon: 'read',
        path: '/teacher/student/score'
      },
      {
        key: '2',
        title: '学期学生',
        icon: 'team',
        path: '/term/student'
      },
      {
        key: '222',
        title: '基础数据',
        icon: 'bars',
        children: [
          {
            key: '3',
            title: '班级列表',
            icon: 'menu',
            path: '/class'
          },
          {
            key: '4',
            title: '学生名单',
            icon: 'team',
            path: '/student'
          }
        ]
      },
      {
        key: '5',
        title: '时钟',
        icon: 'clock-circle',
        path: '/clock'
      }
    ],
    termList: [
      {
        value: '2022-下半学期',
        label: '2022-下半学期'
      }, {
        value: '2022-上半学期',
        label: '2022-上半学期'
      }, {
        value: '2021-下半学期',
        label: '2021-下半学期'
      }, {
        value: '2021-上半学期',
        label: '2021-上半学期'
      }, {
        value: '2020-下半学期',
        label: '2020-下半学期'
      }, {
        value: '2020-上半学期',
        label: '2020-上半学期'
      }
    ]
  },

  getters: {
    menuList: state => state.menuList,
    termOptions: state => state.termList
  }
}

export default optionsModule
