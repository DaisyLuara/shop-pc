<template>
  <div class="main">
    <div class="menu-bar">
      <div class="logo-wrap">
        <div class="logo">
          <img 
            :src="IMG_URL+'ad_shop/img/logo.png'" 
            @click="toGuide">
        </div>
      </div>
      <div class="menu-wrap">
        <div class="menu-wrap_shop">
          <span style="font-weight:600;">积分:</span>
          <img 
            :src="group_icon" 
            style="width: 12%;">
          <span>{{ group_name }}</span>
          <span>{{ p_credits }}</span>
        </div>
        <div 
          class="menu-wrap_shop" 
          @click="gotoCarts">
          <img :src="IMG_URL+'ad_shop/img/shop_icon.png'">
          购物车
        </div>
        <el-dropdown 
          :hide-on-click="true" 
          @command="handleCommand">
          <div class="user-avatar-wrap">
            <div 
              :class="noLogo ? 'user-avatar-no-logo':'user-avatar-logo'" 
              class="user-avatar">
              <img :src="logo">
              <i 
                class="el-icon-arrow-down" 
                style="color:#fff;font-size: 16px;"/>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="account_set">
              <span class="item-info">账号设置</span>
            </el-dropdown-item>
            <el-dropdown-item 
              divided 
              command="logout">
              <span class="item-info">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="first-sidebar">
      <el-menu 
        :default-active="'/' + currModule" 
        router>
        <el-menu-item 
          v-for="m in modules" 
          :key="m.path" 
          :index="'/' + m.path" 
          class="menu-item">
          <img 
            :src="IMG_URL+ m.src +'.png?v=1'" 
            class="icon-default">
          <img 
            :src="IMG_URL+ m.src +'_white.png?v=1'" 
            class="white-icon">
          {{ m.meta.title }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="modules">
      <router-view/>
    </div>
  </div>
</template>

<script>
const IMG_URL = process.env.IMG_URL;
import {
  Menu,
  MenuItem,
  Popover,
  Button,
  Badge,
  Icon,
  Dropdown,
  DropdownItem,
  DropdownMenu
} from "element-ui";
import auth from "service/auth";

import { getCreditTotal } from "service";

export default {
  name: "Home",
  components: {
    "el-menu": Menu,
    "el-menu-item": MenuItem,
    "el-popover": Popover,
    "el-button": Button,
    "el-badge": Badge,
    "el-dropdown": Dropdown,
    "el-dropdown-item": DropdownItem,
    "el-dropdown-menu": DropdownMenu
  },
  data() {
    return {
      IMG_URL: IMG_URL,
      visible: false,
      user_name: "",
      logo: null,
      noLogo: true,
      group_name: "",
      p_credits: 0,
      group_icon: ""
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
              case "device":
                m.src = "ad_shop/img/device_icon";
                break;
              case "prize":
                m.src = "ad_shop/img/gift_icon";
                break;
              case "resource":
                m.src = "ad_shop/img/resource_icon";
                break;
              case "report":
                m.src = "ad_shop/img/chart_icon";
                break;
              case "shop":
                m.src = "ad_shop/img/try_icon";
                break;
              case "resource":
                m.src = "ad_shop/img/resource_icon";
                break;
              case "ad":
                m.src = "ad_shop/img/ad_icon";
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
  mounted() {
    this.getCreditTotal();
  },
  created() {
    let customer = JSON.parse(localStorage.getItem("customer_info"));
    customer.roles = customer.display_name;
    this.user_name = customer.company.internal_name;
    if (customer.company.logoMedia) {
      this.noLogo = customer.company.logoMedia.url ? false : true;
      this.logo = customer.company.logoMedia.url
        ? customer.company.logoMedia.url
        : this.IMG_URL + "ad_shop/img/avatar_white.png";
    } else {
      this.noLogo = true;
      this.logo = this.IMG_URL + "ad_shop/img/avatar_white.png";
    }
    this.$store.commit("setCurUserInfo", customer);
  },
  methods: {
    gotoCarts() {
      this.$router.push({
        path: "/account/cart"
      });
    },
    getCreditTotal() {
      getCreditTotal(this)
        .then(res => {
          let { group_name, p_credits, group_icon } = res;
          this.group_name = group_name;
          this.p_credits = p_credits;
          this.group_icon = group_icon;
        })
        .catch(err => {});
    },
    handleCommand(command) {
      switch (command) {
        case "account_set":
          this.$router.push({
            path: "/account/datum"
          });
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    toGuide() {
      this.$router.push({
        path: "/guide"
      });
    },
    logout() {
      this.visible = false;
      auth.logout(this);
    }
  }
};
</script>

<style lang="less">
@import "../assets/css/pcCommon.less";
.menu-bar {
  display: flex;
  flex-direction: row;
  background: #7e58cc;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 300;
  .logo-wrap {
    position: relative;
    display: flex;
    width: 140px;
    height: 60px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .logo {
      width: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
      }
    }
  }
  .menu-wrap {
    color: #fff;
    display: flex;
    flex-direction: row;
    width: 90%;
    justify-content: flex-end;
    margin-right: 30px;
    align-items: center;
    .user-avatar-wrap {
      cursor: pointer;
      width: 60px;
      .user-avatar {
        border-radius: 5px;
        img {
          width: 60%;
          border-radius: 50%;
        }
      }
      .user-avatar-no-logo {
        background: #627fa3;
      }
      .user-avatar-logo {
        background: none;
      }
      .user-name {
        color: #fff;
        font-weight: 600;
        text-align: center;
        margin-top: 15px;
        .title {
          word-break: break-word;
        }
      }
    }
    .menu-wrap_shop {
      color: #fff;
      margin-right: 20px;
      cursor: pointer;
      font-size: 14px;
      img {
        width: 30%;
      }
    }
  }
}
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
