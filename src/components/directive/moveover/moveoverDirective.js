import { isNull } from '../../../utils/index'

function autoLayout (el, parent) {
  // 列12等分， 行12等分
  const drawPane = el.parentElement
  const width = drawPane.scrollWidth
  const height = drawPane.scrollHeight

  const columns = calcPointsArrary()
  const offsetLeft = el.offsetLeft
  const offsetLeftPercent = offsetLeft / width * 100
  const offsetTop = el.offsetTop
  const offsetTopPercent = offsetTop / height * 100

  // 计算吸附最近的rect
  const leftNearlyPoint = calcNearlyPoint(columns, { x: offsetLeftPercent, y: offsetTopPercent }, false)
  const topNearlyPoint = calcNearlyPoint(columns, { x: offsetLeftPercent, y: offsetTopPercent }, true)
  if (topNearlyPoint.y <= 33 && el.id !== 'root') {
    topNearlyPoint.y = 33.3333333
  }
  el.style.left = `${leftNearlyPoint.x}%`
  el.style.top = `${topNearlyPoint.y}%`

  if (el.id !== 'root') {
    setTimeout(() => {
      const root = document.getElementById(parent || 'root')
      connect(root, el, '#ec800d', 1)
    }, 300)
  }

  function getOffset (el) {
    const rect = el.getBoundingClientRect()
    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width || el.offsetWidth,
      height: rect.height || el.offsetHeight
    }
  }

  function getOffsetByBody (el) {
    let offsetTop = 0
    let offsetLeft = 0
    while (el && el.tagName !== 'BODY') {
      offsetTop += el.offsetTop
      offsetLeft += el.offsetLeft
      el = el.offsetParent
    }
    return { offsetTop, offsetLeft }
  }

  // draw a line connecting elements
  function connect (div1, div2, color, thickness) {
    const off1 = getOffset(div1)
    const off2 = getOffset(div2)
    const offset = getOffsetByBody(el)

    // bottom right
    const x1 = off1.left + off1.width / 2 - offset.offsetLeft + el.offsetLeft
    const y1 = off1.top + off1.height / 2 - offset.offsetTop + el.offsetTop
    // top right
    const x2 = off2.left + off2.width / 2 - offset.offsetLeft + el.offsetLeft
    const y2 = off2.top + off2.height / 2 - offset.offsetTop + el.offsetTop
    // distance
    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)))
    // center
    const cx = ((x1 + x2) / 2) - (length / 2)
    const cy = ((y1 + y2) / 2) - (thickness / 2)
    // angle
    const angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI)

    const div = document.createElement('div')
    div.id = `node-line-${el.id}`
    div.style.zIndex = 100
    div.style.padding = '0px'
    div.style.margin = '0px'
    div.style.height = `${thickness}px`
    div.style.backgroundColor = `${color}`
    div.style.lineHeight = '1px'
    div.style.position = 'absolute'
    div.style.left = `${cx}px`
    div.style.top = `${cy}px`
    div.style.width = `${length}px`
    div.style.transform = `rotate(${angle}deg)`
    el.parentElement.appendChild(div)
  }

  function calcPointsArrary () {
    const columns = []
    const w = 100 / 12
    const h = 100 / 12
    for (let i = 0; i < 12; i++) {
      columns.push({
        x: i * w,
        y: i * h
      })
    }
    return columns
  }

  function calcNearlyPoint (points, target, v) {
    if (!points && points.length <= 0) {
      return { x: 0, y: 0 }
    }
    let point = points[0]
    for (let i = 1; i < points.length; i++) {
      const source = points[i]
      if (v) {
        if (Math.abs(target.y - point.y) >= Math.abs(target.y - source.y)) {
          point = source
          continue
        }
      } else {
        if (Math.abs(target.x - point.x) >= Math.abs(target.x - source.x)) {
          point = source
          continue
        }
      }
    }
    return point
  }
}

export default {

  inserted (el, binding, vnode) {
    const param = binding.value

    autoLayout(el, param.parent)

    if (!isNull(param) && !param.sticky) {
      el.onmousedown = (event) => {
        el.style.userSelect = 'none'

        const e = event || window.event
        const offsetLeft = e.target.offsetLeft
        const offsetTop = e.target.offsetTop
        const clientX = e.clientX
        const clientY = e.clientY
        const marginLeft = clientX - offsetLeft
        const marginTop = clientY - offsetTop

        document.onmousemove = (event) => {
          const line = document.getElementById(`node-line-${el.id}`)
          line && el.parentElement.removeChild(line)

          const e = event || window.event
          const clientX = e.clientX
          const clientY = e.clientY

          el.style.left = `${clientX - marginLeft}px`
          el.style.top = `${clientY - marginTop}px`
        }
      }
      el.onmouseup = (event) => {
        document.onmousemove = null
        el.style.userSelect = 'auto'

        autoLayout(el, param.parent)
      }
    }
  }
}
