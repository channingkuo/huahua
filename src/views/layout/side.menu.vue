<template>
  <div class="side-menu">
    <a-menu theme="dark" mode="inline" :selectedKeys="openedKeys" @click="openPage">
      <template v-for="menu in menuList">
        <a-menu-item v-if="!menu.children || menu.children.length <= 0" :key="menu.key">
          <a-icon :type="menu.icon" style="vertical-align: 1px" />
          <span>{{ menu.title }}</span>
        </a-menu-item>
        <sub-menu v-else :key="menu.key" :menu-info="menu" />
      </template>
    </a-menu>
  </div>
</template>

<script>
import SubMenu from './sub.menu'
import { mapGetters } from 'vuex'
import { isEmpty } from '../../utils/common'

export default {
  name: 'Side-Menu',
  inject: ['reload'],
  components: {
    SubMenu
  },
  data() {
    return {
      openedKeys: []
    }
  },
  created() {
    const { path } = this.$route
    const menu = this.menuList.find((menu) => menu.path === path)
    if (menu) {
      this.openedKeys = [menu.key]
    }
    console.log(this.openedKeys)
  },
  methods: {
    openPage({ item, key, keyPath }) {
      console.log(key)
      this.openedKeys = [key]
      const menuIndex = this.menuList.findIndex((item) => item.key === key)
      let path = ''
      if (menuIndex < 0) {
        const menu = this.menuList[3]
        if (menu.children && menu.children.length > 0) {
          const index = menu.children.findIndex((item) => item.key === key)
          if (index >= 0) {
            path = menu.children[index].path
          } else {
            this.$message.error('菜单异常，请联系Kuo! (♥ω♥)~♪ ')
            return
          }
        } else {
          this.$message.error('菜单异常，请联系Kuo! (♥ω♥)~♪ ')
          return
        }
      } else {
        const menu = this.menuList[menuIndex]
        path = menu.path
      }

      if (isEmpty(path)) {
        this.$message.error('菜单异常，请联系Kuo! (♥ω♥)~♪ ')
        return
      }
      this.$router.push({ path: path }).catch((err) => {
        console.error(err)
      })
    }
  },
  computed: {
    ...mapGetters(['menuList'])
  }
}
</script>

<style lang="scss" scoped>
  .side-menu {
    margin-top: 82px;
  }
</style>
