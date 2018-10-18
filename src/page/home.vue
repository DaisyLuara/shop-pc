<template>
  <div 
    class="main">
    <div 
      class="first-sidebar">
      <div 
        class="logo-wrap">
        <div 
          class="logo">
          <img 
            :src="IMG_URL+'ad_shop/img/logo-icon.png'">
        </div>
      </div>
      <el-menu 
        :default-active="'/' + currModule" 
        router >
        <el-menu-item 
          v-for="m in modules"
          :key="m.path" 
          :index="'/' + m.path" 
          class="menu-item" >
          <img 
            :src="m.src" 
            class="first-sidebar-icon">
          {{ m.meta.title }}
        </el-menu-item>
      </el-menu>
    </div>
    <div 
      class="modules">
      <router-view/>
    </div>
  </div>
</template>

<script>
const IMG_URL = process.env.IMG_URL
import { Menu, MenuItem, Popover, Button, Badge, Icon } from 'element-ui'
import auth from 'service/auth'

export default {
  name: 'Home',
  components: {
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    'el-popover': Popover,
    'el-button': Button,
    'el-badge': Badge
  },
  data() {
    return {
      IMG_URL: IMG_URL,
      visible: false
    }
  },
  computed: {
    modules() {
      let items = []
      for (let route of this.$router.options.routes) {
        if (route.path == '/') {
          for (let m of route['children']) {
            if (!auth.checkPathPermission(m) || !m.meta || !m.meta.title) {
              continue
            }
            switch (m.path) {
              case 'ad':
                m.src = this.IMG_URL + 'ad_shop/img/ad-icon.png'
                break
              case 'point':
                m.src = this.IMG_URL + 'ad_shop/img/point-icon.png'
                break
              case 'account':
                m.src = this.IMG_URL + 'ad_shop/img/account-icon.png'
                break
              case 'resource':
                m.src = this.IMG_URL + 'ad_shop/img/material.png'
                break
              case 'report':
                m.src = this.IMG_URL + 'ad_shop/img/report-icon.png'
                break
              case 'verify':
                m.src = this.IMG_URL + 'ad_shop/img/verify-icon.png'
                break
              default:
                m.src = ''
                break
            }
            items.push(m)
          }
        }
      }
      return items
    },
    currModule() {
      let path = this.$store.getters.currRoute.path
      for (let m of this.modules) {
        if (path.indexOf('/' + m.path) == 0) {
          return m.path
        }
      }
      return ''
    },
    name() {
      return this.$store.state.curUserInfo.name
        ? this.$store.state.curUserInfo.name
        : ''
    }
  },
  created() {
    let customer = JSON.parse(localStorage.getItem('customer_info'))
    customer.roles = customer.display_name
    this.$store.commit('setCurUserInfo', customer)
  },
  methods: {
    logout() {
      this.visible = false
      auth.logout(this)
    }
  }
}
</script>

<style lang="less">
@import '../assets/css/pcCommon.less';
.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.el-badge__content {
  border: none;
}
.el-badge__content.is-fixed {
  top: 10px;
  right: 45px;
}
.logo-wrap {
  .logo {
    margin-top: 15px;
  }
}
.modules-top {
  padding-top: 0;
}

.el-popover.popper-logout {
  padding: 0;
  min-width: 80px;
  text-align: center;
}
.logout-btn {
  display: block;
  width: 100%;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  font-size: 14px;
}

.first-sidebar-icon {
  padding-right: 8px;
  margin-left: -3px;
  height: 16px;
}
.sidebar-user {
  position: absolute;
  bottom: 0;
  display: table;
  width: 100%;
  height: 90px;
  text-align: center;
  // background: #20a0ff url(../assets/images/user-bg.png) no-repeat center 5px;
  color: #fff;
  cursor: pointer;
  .avatar {
    width: 100%;
  }
}
.sidebar-user-block {
  position: absolute;
  z-index: 33;
  top: 10%;
  left: 16%;
  right: 16%;
  color: #000;
  font-weight: 600;
  // display: table-cell;
  // vertical-align: middle;
}
.sidebar-user-item {
  max-width: 90px;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  &.sidebar-user-item-main {
    font-size: 20px;
  }
  &.sidebar-user-item-sub {
    font-size: 14px;
  }
}
</style>
