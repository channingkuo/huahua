<template>
  <a-tag :color="colors[findTag().index]">{{ findTag().name }}</a-tag>
</template>

<script>
import { isEmpty, isNull } from '../utils/index'

export default {
  name: 'Tag-Color',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number]
    }
  },
  data() {
    return {
      colors: [
        'pink',
        'volcano',
        'magenta',
        'yellow',
        'red',
        'orange',
        'gold',
        'cyan',
        'lime',
        'green',
        'blue',
        'geekblue',
        'purple'
      ]
    }
  },
  created() {},
  methods: {
    isEmpty,
    findTag() {
      if (!isNull(this.options) && !isEmpty(this.value)) {
        for (let i = 0; i < this.options.length; i++) {
          const option = this.options[i]
          if (this.value.toString() === option.value.toString()) {
            return { name: option.label, index: i }
          }
        }
      } else {
        return { name: this.value, index: 0 }
      }
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
</style>
