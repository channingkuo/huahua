<template>
  <div class="layout">
    <a-layout>
      <a-layout-sider
        v-model="calCollapsed"
        :trigger="null"
        class="side-layout"
        :style="{
          width: `${this.collapsedLeft}px`,
          flex: `0 0 ${this.collapsedLeft}px`,
          maxWidth: `${this.collapsedLeft}px`,
          minWidth: `${this.collapsedLeft}px`
        }"
      >
        <div
          @click="home"
          :style="{
            width: `${this.collapsedLeft}px`,
            opacity: this.collapsedLeft
          }"
          class="logo align-center"
          :class="calCollapsed ? 'flex justify-center' : 'flex justify-around'"
        >
          <img src="../../assets/imgs/logo-white.png" />
          <img v-show="!calCollapsed" src="../../assets/imgs/logo-text-white.png" />
        </div>
        <side-menu></side-menu>
      </a-layout-sider>
      <a-layout
        class="right-layout"
        :style="{
          marginLeft: `${this.collapsedLeft}px`,
          marginTop: `${this.stickyHeader ? '50px' : '0px'}`
        }"
      >
        <a-back-top class="content-back-top" />
        <a-layout-header
          class="header-layout"
          :style="{
            width: `calc(100vw - ${this.collapsedLeft}px)`,
            position: `${this.stickyHeader ? 'fixed' : 'relative'}`
          }"
        >
          <header-content></header-content>
        </a-layout-header>
        <a-layout-content class="content-layout">
          <main-content :loading="!isRouterAlive"></main-content>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderContent from './header'
import SideMenu from './side.menu'
import MainContent from './content'

export default {
  name: 'Layout',
  components: {
    HeaderContent,
    MainContent,
    SideMenu
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      top: 10,
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.isRouterAlive = true
        }, 300)
      })
    },
    home() {
      console.log('home')
    }
  },
  computed: {
    ...mapGetters(['collapsed', 'collapsedLeft', 'stickyHeader']),
    calCollapsed() {
      return this.collapsed !== 'full'
    }
  }
}
</script>

<style lang="scss" scoped>
  .logo {
    padding: 16px;
    position: fixed;
    z-index: 100;
    background: #001529;
    top: 0;
    left: 0;
    cursor: pointer;
    transition: width 0.2s;
    img {
      height: 50px;
    }
  }
  .ant-layout {
    background-color: $content-background-color;
  }
  .side-layout {
    overflow: auto;
    height: 100vh;
    position: fixed;
    left: 0;
    z-index: 1001;
  }
  .right-layout {
    margin-left: 200px;
    margin-top: 90px;
    z-index: 1000;
  }
  .content-back-top {
    z-index: 10002;
    right: 20px;
    bottom: 20px;
  }
  .header-layout {
    overflow: hidden;
    position: fixed;
    width: calc(100vw - 200px);
    height: 50px;
    top: 0;
    background: #fff;
    padding: 0;
    z-index: 1001;
  }
  .content-layout {
    margin: 0 20px;
    overflow: initial;
    z-index: 1000;
    border-top: 0.55px solid #eee;
  }
</style>
