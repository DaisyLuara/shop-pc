<template>
  <div>
    <el-dropdown 
      :hide-on-click="true" 
      class="avatar-wrap">
      <div class="avatar-block">
        <span>{{ name }}</span>
        <img 
          src="~assets/images/user-default-icon.png" 
          alt 
          class="avatar">
      </div>
      <el-dropdown-menu 
        slot="dropdown" 
        placement="bottom">
        <el-dropdown-item>
          <span 
            class="item-info" 
            @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { Dropdown, DropdownItem, DropdownMenu } from "element-ui";
import auth from "service/auth";

export default {
  components: {
    "el-dropdown": Dropdown,
    "el-dropdown-item": DropdownItem,
    "el-dropdown-menu": DropdownMenu
  },
  data() {
    return {
      visible: false,
      name: ""
    };
  },
  created() {
    this.name = this.$store.state.curUserInfo.company.name;
  },
  methods: {
    logout() {
      this.visible = false;
      auth.logout(this);
    }
  }
};
</script>

<style lang="less" scoped>
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
.avatar-wrap {
  position: absolute;
  top: 8px;
  right: 30px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  .avatar-block {
    span {
      color: #000;
      margin-right: 10px;
    }
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
  .avatar {
    height: 70%;
    border-radius: 50%;
  }
}
</style>
