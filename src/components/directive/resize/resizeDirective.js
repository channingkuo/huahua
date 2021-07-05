import store from '../../../store'

export default {

  inserted (el, binding, vnode) {
    el.onmousedown = (event) => {
      document.body.style.userSelect = 'none'

      const e = event || window.event
      const offsetX = e.offsetX
      const origin = e.target.offsetLeft

      document.onmousemove = (event) => {
        const e = event || window.event
        const clientX = e.clientX
        const left = clientX - offsetX
        el.style.left = `${left}px`

        store.commit('setCollapsedLeft', left)

        // 向左移
        if (origin === 200) {
          if (left > 100 && left <= 140) {
            store.commit('setCollapsed', 'half')
            store.commit('setCollapsedLeft', 80)
            el.style.left = '80px'
            document.onmousemove = null
            document.body.style.userSelect = 'auto'
            // console.log('origin === 200 || left > 100 && left <= 140')
          } else if (left > 200) {
            store.commit('setCollapsed', 'full')
            store.commit('setCollapsedLeft', 200)
            el.style.left = '200px'
            document.onmousemove = null
            document.body.style.userSelect = 'auto'
            // console.log('origin === 200 || left > 200')
          }
        } else if (origin === 80) {
          // 中间
          if (left < 60) {
            store.commit('setCollapsed', 'none')
            store.commit('setCollapsedLeft', 0)
            el.style.left = '0px'
            document.onmousemove = null
            document.body.style.userSelect = 'auto'
            // console.log('origin === 80 || left < 60')
          } else if (left > 100) {
            store.commit('setCollapsed', 'full')
            store.commit('setCollapsedLeft', 200)
            el.style.left = '200px'
            document.onmousemove = null
            document.body.style.userSelect = 'auto'
            // console.log('origin === 80 || left > 100')
          }
        } else if (origin === 0) {
          // 向右移
          if (left > 20 && left <= 80) {
            store.commit('setCollapsed', 'half')
            store.commit('setCollapsedLeft', 80)
            el.style.left = '80px'
            document.onmousemove = null
            document.body.style.userSelect = 'auto'
            // console.log('origin === 0 || left > 20 && left <= 80')
          } else if (left < 0) {
            store.commit('setCollapsed', 'none')
            store.commit('setCollapsedLeft', 0)
            el.style.left = '0px'
            document.onmousemove = null
            document.body.style.userSelect = 'auto'
            // console.log('origin === 0 || left < 0')
          }
        } else {
          // 处理特殊情况，默认设置成half状态
          store.commit('setCollapsed', 'half')
          store.commit('setCollapsedLeft', 80)
          el.style.left = '80px'
          document.onmousemove = null
          document.body.style.userSelect = 'auto'
        }
      }
    }
    el.onmouseup = (event) => {
      document.onmousemove = null
      document.body.style.userSelect = 'auto'
    }
  }
}
