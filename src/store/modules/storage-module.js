const storageModule = {
  state: {
    locale: null,
    // 'full', 'half', 'none'
    collapsed: 'full',
    collapsedLeft: 200,
    stickyBreadcrumb: true,
    stickyHeader: true
  },

  getters: {
    locale: state => state.locale,
    collapsed: state => { return state.collapsed || sessionStorage.getItem('collapsed') },
    collapsedLeft: state => { return state.collapsedLeft || parseInt(sessionStorage.getItem('collapsedLeft')) },
    stickyBreadcrumb: state => { return state.stickyBreadcrumb || Boolean(localStorage.getItem('stickyBreadcrumb') === 'true') },
    stickyHeader: state => { return state.stickyHeader || Boolean(sessionStorage.getItem('stickyHeader') === 'true') }
  },

  mutations: {
    setLocale (state, locale) {
      state.locale = locale
    },
    setCollapsed (state, collapsed) {
      state.collapsed = collapsed
    },
    setCollapsedLeft (state, collapsedLeft) {
      state.collapsedLeft = collapsedLeft
    },
    setStickyBreadcrumb (state, stickyBreadcrumb) {
      state.stickyBreadcrumb = stickyBreadcrumb
    },
    setStickyHeader (state, stickyHeader) {
      state.stickyHeader = stickyHeader
    }
  }
}

export default storageModule
