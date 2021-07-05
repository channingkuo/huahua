// import moveover from './moveover/moveoverDirective'
// import resize from './resize/resizeDirective'
import permission from './permission/permissionDirective'
import copy from './copy/copyDirective'
import longpress from './longpress/longpressDirective'
import debounce from './debounce/debounceDirective'
import pattern from './pattern/patternDirective'
import lazyLoad from './lazyLoad/lazyLoadDirective'
import waterMarker from './waterMarker/waterMarkerDirective'
import draggable from './draggable/draggableDirective'

const directives = {
  // moveover,
  // resize,
  permission,
  copy,
  longpress,
  debounce,
  pattern,
  lazyLoad,
  waterMarker,
  draggable
}

export default {
  install (Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
