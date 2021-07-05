const userPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe(({ type, payload }, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    if (type === 'setUserInfo') {
      localStorage.setItem('UserInfo', payload)
    } else if (type === 'setAccessToken') {
      localStorage.setItem('AccessToken', payload)
    }
  })
}

export default userPlugin
