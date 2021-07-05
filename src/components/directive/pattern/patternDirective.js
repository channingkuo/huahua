import { isEmpty } from '../../../utils/index'

const findEle = (parent, type) => {
  return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
}

const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

const pattern = {
  bind: function (el, binding, vnode) {
    // 正则规则可根据需求自定义
    // eslint-disable-next-line no-useless-escape
    const defaultRegRule = /[^\u4E00-\u9FA5|\d|\a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g
    const regRule = isEmpty(binding.value) ? defaultRegRule : binding.value
    const $inp = findEle(el, 'input')
    el.$inp = $inp
    $inp.handle = function () {
      const val = $inp.value
      $inp.value = val.replace(regRule, '')

      trigger($inp, 'input')
    }
    $inp.addEventListener('keyup', $inp.handle)
  },
  unbind: function (el) {
    el.$inp.removeEventListener('keyup', el.$inp.handle)
  }
}

export default pattern
