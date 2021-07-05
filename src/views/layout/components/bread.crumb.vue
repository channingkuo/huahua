<template>
  <a-breadcrumb>
    <a-breadcrumb-item>面包屑</a-breadcrumb-item>
    <a-breadcrumb-item>还没想好怎么设定</a-breadcrumb-item>
    <!-- <a-breadcrumb-item v-for="item in breadcrumb" :key="item.path">
      {{ item.title }}
    </a-breadcrumb-item> -->
    <!-- <a-breadcrumb-item v-for="path in parentPath" :key="path.id">
      {{ path.meta.title }}
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="activedTab.id !== lastParentPath.id">
      {{ activedTab.meta.title }}
    </a-breadcrumb-item> -->
  </a-breadcrumb>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'Bread-Crumb',
  data() {
    return {
      breadcrumb: []
    }
  },
  created() {
    const { path, meta } = this.$route
    this.breadcrumb.push({
      path,
      title: meta.title
    })
  },
  watch: {
    $route: {
      handler(val, oldval) {
        // 新路由信息
        console.log(val)
        // 老路由信息
        console.log(oldval)
      },
      deep: true
    }
  },
  methods: {},
  computed: {
    // ...mapGetters(['menuList'])
  }
}
</script>
