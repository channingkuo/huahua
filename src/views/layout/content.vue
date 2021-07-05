<template>
  <div class="main-content">
    <div
      v-resize
      class="view-switch flex justify-center items-center"
      :style="{ left: `${this.collapsedLeft}px` }"
    >
      <div class="view-switch-bar"></div>
    </div>
    <transition name="slide-fade" mode="out-in" v-if="!loading">
      <!-- <keep-alive> -->
      <router-view style="padding-top: 10px" />
      <!-- </keep-alive> -->
    </transition>
    <a-spin
      v-if="loading"
      class="page-reload-spin"
      :style="{ left: `calc(50% + ${this.collapsedLeft / 2 - 20}px)` }"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import resize from '../../components/directive/resize'

export default {
  name: 'Main-Content',
  directives: {
    resize
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['collapsedLeft'])
  }
}
</script>

<style lang="scss" scoped>
  .view-switch {
    position: fixed;
    top: 0;
    // left: 200px;
    height: 100%;
    width: 10px;
    cursor: col-resize;
  }
  .view-switch-bar {
    width: 4px;
    height: 40px;
    border-radius: 2px;
    background-color: $primary-color;
    opacity: 0;
  }
  .view-switch:hover {
    .view-switch-bar {
      opacity: 1;
    }
  }
  .page-reload-spin {
    position: absolute;
    top: 200px;
  }

  // 设置不同的菜单加载过场动画
  // slide-fade
  .slide-fade-enter-active {
    transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-leave-active {
    transition: all 0.1s ease;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }

  // fade
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  // push
  .push-enter-active,
  .push-leave-to {
    transition: all 0.1s ease;
  }
  .push-enter {
    transform: translateX(-100%);
    opacity: 0;
  }
  .push-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
</style>
