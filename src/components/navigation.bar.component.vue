<template>
  <a-breadcrumb :style="{ marginBottom: '8px' }">
    <!-- <a-breadcrumb-item>首页</a-breadcrumb-item>
    <a-breadcrumb-item v-for="path in parentPath" :key="path.id">
      {{ path.meta.title }}
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="activedTab.id !== lastParentPath.id">{{
      activedTab.meta.title
    }}</a-breadcrumb-item>
    <a-breadcrumb-item>{{ this.$route.meta.title }}</a-breadcrumb-item>
    <a-breadcrumb-item v-if="canBack"><a @click="goBack">返回</a></a-breadcrumb-item> -->
  </a-breadcrumb>
</template>

<script>
// import { mapGetters } from 'vuex'
// import { findParentPath } from '../utils'

// export default {
//   name: 'Navigation-Bar',
//   components: {},
//   props: {
//     canBack: {
//       type: Boolean,
//       default: false
//     }
//   },
//   data() {
//     return {}
//   },
//   created() {},
//   methods: {
//     goBack() {
//       this.$router.back()
//     }
//   },
//   computed: {
//     ...mapGetters(['menuList', 'activedTab']),
//     parentPath() {
//       console.log('findParentPath', findParentPath(this.menuList, this.activedTab.id))
//       console.log('this.$route', this.$route)
//       console.log('this.menuList', this.menuList)
//       console.log('this.activedTab', this.activedTab)
//       return findParentPath(this.menuList, this.activedTab.id)
//     },
//     lastParentPath() {
//       return this.parentPath[this.parentPath.length - 1]
//     }
//   }
// }
</script>

<style lang="scss" scoped>
  a {
    color: #1890ff !important;
  }
  a:hover {
    color: #40a9ff !important;
  }
</style>
