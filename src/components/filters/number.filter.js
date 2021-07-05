import Vue from 'vue'

Vue.filter('formatNumber', (value, formatStyle) => {
  const num = Number(value)
  return num.toFixed(formatStyle || 2)
})
