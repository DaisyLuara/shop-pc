<template>
  <div class="main">
    <div class="header">
      <div class="left-logo">
        <img
          :src="IMG_URL+ '/ad_guide/logo.png'"
          class="logo-icon"
        />
        <span class="logo-name">召唤宝智能商户平台</span>
      </div>
      <div class="right-tabs">
        <ul class="tabs-ul">
          <li
            v-for="item in tabs"
            :key="item.id"
            @click="handleTab(item)"
          ><a :class="item.class">{{item.name}}</a></li>
        </ul>
      </div>
    </div>
    <div class="modules-guide">
      <router-view />
    </div>
    <div class="footer">
      <div class="mycompany">
        <img
          :src="IMG_URL+ '/ad_guide/actiview.png'"
          class="company-icon"
        />
        <span>上海星视度科技有限公司</span>
      </div>
      <div class="myrecord">沪ICP备 17045724号-2 <i class="el-icon-police"></i> 沪公网安备 31011502008032号</div>
    </div>
  </div>
</template>
<script>
const IMG_URL = process.env.IMG_URL;
import { Tabs, TabPane, Icon } from "element-ui";
export default {
  name: "Guide",
  components: {
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-icon': Icon
  },
  data() {
    return {
      IMG_URL: IMG_URL,
      activeName: '',
      tabs: [
        {
          name: '首页',
          key: 'index',
          path: '/guide/index',
          class: 'tab-item'
        },
        {
          name: '关于',
          key: 'about',
          path: '/guide/about',
          class: 'tab-item'
        },
        {
          name: '登录',
          key: 'login',
          path: '/login',
          class: 'tab-item'
        },
        {
          name: '免费体验',
          key: 'sampleLogin',
          path: '/guide/login',
          class: 'tab-item item-lighter'
        },
      ]

    };
  },
  computed: {

  },
  mounted() { },
  created() {
  },
  methods: {
    handleTab(item) {
      this.$router.push({
        path: item.path
      })
    }
  }

};
</script>

<style lang="less">
@import "../assets/css/pcCommon.less";
@img: "http://cdn.xingstation.cn/ad_guide/";
a {
  cursor: pointer;
}
button {
  cursor: pointer;
}
.modules-guide {
  padding: 0px;
  margin: 0px;
  position: relative;
  z-index: 0;
  margin-top: 60px;
  background-color: #fff;
}
.header {
  width: 100%;
  height: 60px;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 130;
  .left-logo {
    margin-left: 40px;
    .logo-name {
      color: #6a3fbb;
      font-size: 14px;
      font-weight: bolder;
      margin-left: 10px;
    }
  }
  .right-tabs {
    height: 100%;
    margin-right: 80px;
    .tabs-ul {
      display: inline-block;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      li {
        display: inline-block;
        margin-right: 40px;
      }
    }
    .tab-item {
      font-size: 14px;
      display: inline-block;
      width: 100%;
      height: 100%;
      padding: 2px 15px;
      &:active {
        color: #6a3fbb;
      }
    }
    .tab-active {
      color: #6a3fbb;
    }
    .item-lighter {
      color: #6a3fbb;
      border: solid 1px #6a3fbb;
      border-radius: 15px;
    }
  }
}
.footer {
  width: 100%;
  position: relative;
  text-align: center;
  background-color: #fff;
  z-index: 0;
  padding-top: 10px;
  .mycompany {
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #000;
    img {
      vertical-align: baseline;
      margin-right: 10px;
    }
  }
  .myrecord {
    position: relative;
    color: #aaa;
    font-size: 10px;
    height: 50px;
    line-height: 50px;
    border-top: solid 1px #aaa;
    .el-icon-police {
      vertical-align: middle;
      margin-left: 7px;
      margin-right: 3px;
      &:before {
        display: inline-block;
        content: " ";
        width: 10px;
        height: 10px;
        background: url("@{img}police.png") center center/100% auto no-repeat;
      }
    }
  }
}
</style>
