<template>
  <div class="main">
    <div class="first-sidebar">
      <div class="logo-wrap">
        <div class="logo">
          <img :src="IMG_URL+'ad_shop/img/logo.png'">
        </div>
      </div>
      <div class="user-avatar-wrap">
        <div class="user-avatar">
          <img :src="IMG_URL+'ad_shop/img/avatar_white.png'">
        </div>
        <div class="user-name">
          <span>{{ user_name }}</span>
        </div>
      </div>
      <el-menu :default-active="'/' + currModule" router>
        <el-menu-item v-for="m in modules" :key="m.path" :index="'/' + m.path" class="menu-item">
          <img :src="IMG_URL+ m.src +'.png'" class="icon-default">
          <img :src="IMG_URL+ m.src +'_white.png'" class="white-icon">
          {{ m.meta.title }}
        </el-menu-item>
      </el-menu>
      <div class="logout-btn">
        <img :src="logo" class="logout-icon" @click="logout">
      </div>
    </div>
    <div class="modules">
      <router-view/>
    </div>
  </div>
</template>

<script>
const IMG_URL = process.env.IMG_URL;
import { Menu, MenuItem, Popover, Button, Badge, Icon } from "element-ui";
import auth from "service/auth";

export default {
  name: "Home",
  components: {
    "el-menu": Menu,
    "el-menu-item": MenuItem,
    "el-popover": Popover,
    "el-button": Button,
    "el-badge": Badge
  },
  data() {
    return {
      IMG_URL: IMG_URL,
      visible: false,
      user_name: "",
      logo: null
    };
  },
  computed: {
    modules() {
      let items = [];
      for (let route of this.$router.options.routes) {
        if (route.path == "/") {
          for (let m of route["children"]) {
            if (!auth.checkPathPermission(m) || !m.meta || !m.meta.title) {
              continue;
            }
            switch (m.path) {
              case "site":
                m.src = "ad_shop/img/site_icon";
                break;
              case "account":
                m.src = "ad_shop/img/user_icon";
                break;
              case "auth":
                m.src = "ad_shop/img/auth_icon";
                break;
              case "smart":
                m.src = "ad_shop/img/smart_icon";
                break;
              case "put":
                m.src = "ad_shop/img/put_icon";
                break;
              case "prize":
                m.src = "ad_shop/img/gift_icon";
                break;
              case "report":
                m.src = "ad_shop/img/chart_icon";
                break;
              default:
                m.src = "";
                break;
            }
            items.push(m);
          }
        }
      }
      return items;
    },
    currModule() {
      let path = this.$store.getters.currRoute.path;
      for (let m of this.modules) {
        if (path.indexOf("/" + m.path) == 0) {
          return m.path;
        }
      }
      return "";
    },
    name() {
      return this.$store.state.curUserInfo.name
        ? this.$store.state.curUserInfo.name
        : "";
    }
  },
  mounted() {},
  created() {
    let customer = JSON.parse(localStorage.getItem("customer_info"));
    customer.roles = customer.display_name;
    this.user_name = customer.company.name;
    this.logo = customer.company.logo
      ? customer.company.logo
      : this.IMG_URL + "ad_shop/img/logout_icon.png";
    this.$store.commit("setCurUserInfo", customer);
  },
  methods: {
    logout() {
      this.visible = false;
      auth.logout(this);
    }
  }
};
</script>

<style lang="less">
@import "../assets/css/pcCommon.less";
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
.modules-top {
  padding-top: 0;
}

.el-popover.popper-logout {
  padding: 0;
  min-width: 80px;
  text-align: center;
}
.logout-btn {
  position: absolute;
  bottom: 15px;
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  cursor: pointer;
  flex-direction: row;
  cursor: pointer;
  .logout-icon {
    width: 15%;
    height: 15%;
  }
}

.icon-default {
  padding-right: 15px;
  margin-left: 8px;
  height: 16px;
}
.white-icon {
  padding-right: 15px;
  margin-left: 8px;
  height: 16px;
  display: none;
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
