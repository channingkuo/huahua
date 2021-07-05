import moment from 'moment'
import Vue from 'vue'

Vue.filter('formatDate', (value, formatStyle) => {
  const oDate = moment(value)
  const result = oDate.format(formatStyle || 'YYYY-MM-DD HH:mm:ss')
  return result
})
