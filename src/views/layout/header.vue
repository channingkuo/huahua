<template>
  <div class="header">
    <a-row class="header-content" type="flex" align="middle">
      <a-col v-show="stickyBreadcrumb || collapsed !== 'full'" :span="8">
        <bread-crumb />
        <!-- <span>Test Header</span> -->
      </a-col>
      <a-col :span="stickyBreadcrumb || collapsed !== 'full' ? 12 : 20"></a-col>
      <!-- <a-col :span="4"><header-settings /></a-col> -->
      <!-- <a-icon class="size-change" type="reload" @click="onReloadPage" /> -->
    </a-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BreadCrumb from './components/bread.crumb.vue'

export default {
  name: 'Header-Content',
  inject: ['reload'],
  components: {
    BreadCrumb
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    onReloadPage() {
      this.reload()
    }
  },
  computed: {
    ...mapGetters(['collapsed', 'stickyBreadcrumb', 'nickName'])
  }
}
</script>

<style lang="scss" scoped>
  .header-content {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
  }
  .size-change {
    font-size: 18px;
    margin-right: 7px;
  }
  .size-change:hover {
    color: $primary-color;
    transform: scale(1.2) rotate(360deg);
    transition: transform 0.5s;
  }
</style>
