<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNull } from './utils/index'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

export default {
  name: 'App',
  data() {
    return {}
  },
  created() {
    isNull(this.locale) && this.$store.commit('setLocale', zhCN)
    isNull(this.locale) && moment.locale('zh-cn')
    this.$store.commit('setCollapsed', 'half')
    this.$store.commit('setCollapsedLeft', 80)

    const html = document.getElementsByTagName('html')[0]
    if (navigator.userAgent.toLowerCase().indexOf('mac') >= 0) {
      html.className = (html.className + ' mac').trim()
    } else {
      html.className += (html.className + ' windows').trim()
    }
  },
  computed: {
    ...mapGetters(['locale'])
  }
}
</script>

<style lang="scss">
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: inherit;
  }
</style>
