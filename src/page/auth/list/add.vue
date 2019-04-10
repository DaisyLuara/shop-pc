<template>
  <div>
    <!-- 授权页入口 -->
    <div 
      class="auth-entrance" 
      @click="handleEntClick">
      <div class="entrance-icon">
        <img 
          :src="IMG_URL + 'ad_shop/img/auth/entrance_icon.png'" 
          class="icon">
      </div>
      <div class="entrance-info">
        <div class="entrance-title">授权入口</div>
        <div class="entrance-desc">
          <div>请务必使用电脑端开始授权</div>
          <div>整个授权过程不能关闭页面</div>
        </div>
      </div>
    </div>

    <!-- 配置说明 -->
    <div class="config-intro-wrap">
      <el-tabs type="border-card">
        <el-tab-pane label="账号权限">
          <auth-table/>
        </el-tab-pane>
        <el-tab-pane label="小程序SDK">
          <mp-table/>
        </el-tab-pane>
      </el-tabs>
      <div class="config-intro-title">配置说明</div>
    </div>
  </div>
</template>

<script>
import { Tabs, TabPane } from "element-ui";
import AuthTable from "./TableComponents/AuthTable";
import MpTable from "./TableComponents/MpTable";
import "./addEl.less";

export default {
  name: "AuthListAdd",
  components: {
    "el-tabs": Tabs,
    "el-tab-pane": TabPane,
    AuthTable,
    MpTable
  },
  data() {
    return {
      IMG_URL: process.env.IMG_URL,
      authLink: "http://xingstation.cn/client/wxsdk/wxthird/?api=json&uid=1138"
    };
  },
  methods: {
    handleEntClick() {
      window.open(this.authLink);
    }
  }
};
</script>

<style lang="less" scoped>
.auth-entrance {
  width: 367px;
  height: 60px;
  display: flex;
  align-items: center;
  color: #fff;
  cursor: pointer;
  margin-bottom: 120px;
  .entrance-icon {
    width: 60px;
    height: 60px;
    background: #956fd4;
    padding: 13px;
    img {
      display: block;
      width: 34px;
      height: 34px;
    }
  }
  .entrance-info {
    height: 100%;
    display: flex;
    align-items: center;
    background: #b19bde;
    .entrance-title {
      font-size: 23px;
      font-weight: bold;
      line-height: 33px;
      width: 127px;
      text-align: center;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        border-right: 1px solid #fff;
        transform-origin: 100% 0;
        transform: scaleX(0.5);
      }
    }
    .entrance-desc {
      width: 180px;
      text-align: center;
      div {
        font-size: 11px;
        line-height: 16px;
      }
    }
  }
}

.config-intro-wrap {
  width: 600px;
  position: relative;
  margin-bottom: 70px;
  .config-intro-title {
    position: absolute;
    top: 0;
    left: 0;
    color: #956fd4;
    font-size: 18px;
    line-height: 44px;
  }
}
</style>