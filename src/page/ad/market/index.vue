<template>
  <div 
    class="root">
    <div 
      class="item-list-wrap">
      <el-tabs 
        v-model="activeName">
        <el-tab-pane
          v-if="exeFlag" 
          label="星视度" 
          name="exe">
          <Exe/>
        </el-tab-pane>
        <el-tab-pane
          v-if="authFlag"
          label="已授权" 
          name="auth">
          <Auth/>
        </el-tab-pane>
        <el-tab-pane
          label="公众号授权" 
          name="official">
          <div class="official">
            <div 
              class="official-account" 
              @click="openWXOfficial">
              授权
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Exe from './com/exeMarket'
import Auth from './com/authList'

import { Button, MessageBox, Tabs, TabPane } from 'element-ui'

export default {
  components: {
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    Exe,
    Auth
  },
  data() {
    return {
      authFlag: false,
      exeFlag: false,
      activeName: ''
    }
  },
  created() {
    if (this.$store.state.curUserInfo.roles.data.length > 0) {
      this.$store.state.curUserInfo.roles.data.map(v => {
        if (v.name === 'ad_owner') {
          this.ownFlag = false
          this.exeFlag = true
          this.authFlag = true
          this.activeName = 'exe'
        }
      })
    }
  },
  methods: {
    openWXOfficial() {
      let uid = JSON.parse(localStorage.getItem('customer_info')).ar_id
      let href = 'http://xingstation.cn/client/wxsdk/wxthird/?api=json&uid=' + uid
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.root {
  font-size: 14px;
  color: #5e6d82;
  .item-list-wrap {
    background: #fff;
    padding: 30px;
    .el-select,
    .item-input,
    .el-input {
      width: 380px;
    }
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-table__body-wrapper {
      overflow-x: auto;
      overflow-y: overlay;
      position: relative;
    }
    .official {
      text-align: center;
      .official-account {
        cursor: pointer;
        margin: 50px auto;
        width: 200px;
        padding: 20px;
        border: 1px solid #59b6d4;
        border-radius: 10px;
        font-size: 20px;
        color: #59b6d4;
      }
    }
  }
}
</style>
