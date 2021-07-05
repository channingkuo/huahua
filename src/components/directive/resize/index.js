import resize from './resizeDirective'

const install = function (Vue) {
  Vue.directive('resize', resize)
}

if (window.Vue) {
  // eslint-disable-next-line dot-notation
  window['resize'] = resize
  // eslint-disable-next-line no-undef
  Vue.use(install)
}

resize.install = install
export default resize
