<template>
  <div class="auth-table">
    <el-table
      border
      :header-cell-style="headerStyle"
      :data="authTableData.slice(0, 3)"
      :row-style="authRowStyle"
      :span-method="authSpanmethod"
    >
      <el-table-column
        label="账号性质"
        width="105px"
        align="center"
      >
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.authType"
            :key="index"
            :style="{ fontWeight: 'bold' }"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="140px"
        align="center"
        class-name="hide-right-border"
      >
      </el-table-column>
      <el-table-column
        label="权限功能"
        width="279px"
      >
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.ability" :key="index">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="75px"
        align="center"
        class-name="required-col"
      >
        <template slot-scope="scope">
          <div :class="['is-required', { 'is-danger': scope.row.required }]">
            {{ scope.row.required ? '必选' : '可选' }}
          </div> 
        </template>
      </el-table-column>
    </el-table>
    <el-table
      border
      :show-header="false"
      :data="[authTableData[3]]"
      :row-style="authRowStyle"
    >
      <el-table-column
        label="账号性质"
        width="105px"
        align="center"
      >
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.authType"
            :key="index"
            :style="{ fontWeight: 'bold' }"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="140px"
        align="center"
        class-name="hide-right-border"
      >
      </el-table-column>
      <el-table-column
        label="权限功能"
        width="279px"
      >
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.ability" :key="index">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="75px"
        align="center"
        class-name="required-col"
      >
        <template slot-scope="scope">
          <div :class="['is-required', { 'is-danger': scope.row.required }]">
            {{ scope.row.required ? '必选' : '可选' }}
          </div> 
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  Table,
  TableColumn
} from 'element-ui';

export default {
  name: "AuthTable",
  components: {
    'el-table': Table,
    'el-table-column': TableColumn
  },
  data () {
    return {
      headerStyle: {
        backgroundColor: '#956FD4',
        color: '#FFF',
        paddingLeft: '15px',
        textAlign: 'left'
      },
      authRowStyle: {
        height: '65px'
      },
      authTableData: [{
        authType: ['订阅号', '公众号'],
        authName: '消息管理权限',
        ability: ['当用户关注公众号，系统自动发送图片'],
        required: true
      }, {
        authType: ['订阅号', '公众号'],
        authName: '账号服务权限',
        ability: ['生成用户关注公众号二维码'],
        required: true
      }, {
        authType: ['订阅号', '公众号'],
        authName: '微信卡券权限',
        ability: ['已授权：能对节目投放微信优惠券', '未授权：不能对节目投放微信优惠券'],
        required: false
      }, {
        authType: ['小程序'],
        authName: '账号服务权限',
        ability: ['生成用户关注小程序二维码'],
        required: false
      }]
    }
  },
  methods: {
    authSpanmethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else if(rowIndex === 3) {
          return {
            rowspan: 1,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>