<template>
  <div class="settings flex-justify-flex-end align-center">
    <a-popover placement="bottomRight" v-model="visible">
      <template slot="content">
        <p class="settings-profile">{{ nickName }}</p>
        <p class="settings-item" @click="openSettings">布局设置</p>
        <p class="settings-item">个人中心</p>
        <p class="settings-item" @click="onLogout">退出登录</p>
      </template>
      <div class="flex-justify-center align-center settings-avatar">
        <a-avatar icon="user" :src="userInfo.avatar" :srcSet="userInfo.avatar" />
        <a-icon type="caret-down" />
      </div>
    </a-popover>
    <settings :visible="settingsPaneVisible" @close="onSettingsPaneClose" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Settings from '../../settings/index'

export default {
  name: 'Header-Settings',
  components: {
    Settings
  },
  data() {
    return {
      visible: false,
      settingsPaneVisible: false
    }
  },
  methods: {
    openSettings() {
      this.settingsPaneVisible = true
      this.visible = false
    },
    onSettingsPaneClose() {
      this.settingsPaneVisible = false
    },
    onLogout() {
      this.$store.commit('resetUserInfo')
      this.$router.push({ path: '/login' })
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'nickName'])
  }
}
</script>

<style lang="scss" scoped>
  .settings-profile {
    width: 70px;
    text-align: center;
    padding: 2px 6px;
  }
  .settings-item {
    width: 70px;
    text-align: center;
    cursor: pointer;
    padding: 2px 6px;
  }
  .settings-item:last-child {
    margin-bottom: 0;
    margin-top: -0.5em;
    padding-top: 0.5em;
    // @include k-border($min-color, 0.55px, top);
  }
  .settings-item:hover {
    color: $primary-color;
  }
  .settings-avatar {
    cursor: pointer;
  }
  .settings-avatar:hover span {
    opacity: 0.8;
  }
  .settings-avatar i {
    font-size: 10px;
  }
</style>
