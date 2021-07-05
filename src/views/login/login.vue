<template>
  <a-row class="login" type="flex" justify="start">
    <a-row class="auto-flex select-none" type="flex" justify="center" align="middle">
      <a-col span="8">
        <a-row type="flex" justify="center" align="middle" :gutter="{ xs: 8, sm: 16, md: 24 }">
          <div class="logo-image"></div>
          <a-col class="system-name">花花系统</a-col>
        </a-row>

        <a-row type="flex" justify="center" class="tag-name">账号密码登录</a-row>
        <a-row type="flex" justify="center"><div class="tag-line"></div></a-row>

        <a-row type="flex" justify="center" class="login-content">
          <a-col span="16">
            <a-form id="login-a-form" :form="form" class="login-form" @submit="handleSubmit">
              <a-form-item>
                <a-input
                  v-decorator="[
                    'userName',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请输入账号!'
                        }
                      ]
                    }
                  ]"
                  placeholder="账号"
                >
                  <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="[
                    'password',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请输入密码!'
                        }
                      ]
                    }
                  ]"
                  type="password"
                  placeholder="密码"
                >
                  <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
                </a-input>
              </a-form-item>
              <a-form-item class="test">
                <a-button
                  :loading="loading"
                  type="primary"
                  html-type="submit"
                  class="login-form-button"
                >
                  登录
                </a-button>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- <a-row type="flex" justify="center">
      <a-col class="copyright">苏州药尚网医药技术有限公司 ©{{ year }} All rights reserved.</a-col>
    </a-row> -->
  </a-row>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      redirectPath: undefined,
      loading: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirectPath = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'login-a-form' })
  },
  created() {},
  methods: {
    handleSubmit(e) {
      e.preventDefault()

      this.loading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$store
            .dispatch('login', values)
            .then((res) => {
              this.loading = false
              this.$router.push({ path: this.redirectPath || '/' })
            })
            .catch((err) => {
              this.loading = false
              console.log(err)
            })
        } else {
          this.loading = false
        }
      })
    }
  },
  computed: {
    // ...mapGetters(['userName', 'password', 'remember'])
  }
}
</script>

<style lang="scss" scoped>
  .login {
    // background: url(../../assets/imgs/login-background.png) no-repeat;
    background-size: cover;
    height: inherit;
    flex-direction: column;
  }
  .logo-image {
    width: 44px;
    height: 44px;
    background: url(../../assets/imgs/logo-white.png);
    background-size: cover;
  }
  .system-name {
    font-size: 34px;
    color: $dark-color;
    text-align: center;
  }
  .tag-name {
    font-size: 16px;
    text-align: center;
    height: 24px;
    line-height: 24px;
    color: $primary-color;
    margin-top: 20px;
  }
  .tag-line {
    width: 136px;
    height: 2px;
    background-color: $primary-color;
    margin-top: 6px;
  }
  .login-content {
    margin-top: 40px;
  }
  .login-form-button {
    width: 100%;
  }
  .copyright {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    padding: 10px 0;
  }
</style>
