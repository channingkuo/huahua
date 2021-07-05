import Vue from 'vue'

Vue.filter('formatCurrency', (value, formatStyle) => {
  const num = Number(value)
  const numFixed = num.toFixed(formatStyle || 2)
  return `￥ ${numFixed}`
})
