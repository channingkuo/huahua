<template>
  <div class="side-menu">
    <a-menu theme="dark" mode="inline" :selectedKeys="openedKeys" @click="openPage">
      <template v-for="menu in menuList">
        <a-menu-item :key="menu.key">
          <a-icon :type="menu.icon" style="vertical-align: 1px" />
          <span>{{ menu.title }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Side-Menu',
  inject: ['reload'],
  components: {},
  data() {
    return {
      openedKeys: []
    }
  },
  created() {
    const { path } = this.$route
    const menu = this.menuList.find((menu) => menu.path === path)
    this.openedKeys = [menu.key]
    console.log(this.openedKeys)
  },
  methods: {
    openPage({ item, key, keyPath }) {
      this.openedKeys = [key]
      const path = this.menuList[parseInt(key)].path
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
