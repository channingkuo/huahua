const storagePlugin = store => {
  // 当 store 初始化后调用
  store.subscribe(({ type, payload }, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    if (type === 'setCollapsed') {
      sessionStorage.setItem('collapsed', JSON.stringify(payload))
    } else if (type === 'setCollapsedLeft') {
      sessionStorage.setItem('collapsedLeft', JSON.stringify(payload))
    } else if (type === 'setStickyBreadcrumb') {
      localStorage.setItem('stickyBreadcrumb', JSON.stringify(payload))
    } else if (type === 'setStickyHeader') {
      sessionStorage.setItem('stickyHeader', JSON.stringify(payload))
    }
  })
}

export default storagePlugin
