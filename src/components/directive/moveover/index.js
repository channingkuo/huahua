import moveover from './moveoverDirective'

const install = function (Vue) {
  Vue.directive('moveover', moveover)
}

if (window.Vue) {
  // eslint-disable-next-line dot-notation
  window['moveover'] = moveover
  // eslint-disable-next-line no-undef
  Vue.use(install)
}

moveover.install = install
export default moveover
