<template>
  <div 
    class="root">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="item-list-wrap">
      <div 
        class="item-content-wrap">
        <div 
          class="actions-wrap">
          <span 
            class="label">
            授权总数: {{ pagination.total }}
          </span>
        </div>
        <!-- 搜索 -->
        <div 
          class="search-wrap">
          <el-form 
            ref="adSearchForm" 
            :model="adSearchForm" 
            class="search-form">
            <el-row
              :gutter="4">
              <el-col 
                :span="10">
                <el-form-item 
                  label="" 
                  prop="market_id">
                  <el-select 
                    v-model="adSearchForm.market_id"
                    :loading="searchLoading" 
                    placeholder="请搜索场地" 
                    filterable 
                    clearable>
                    <el-option
                      v-for="item in marketList"
                      :key="item.marketid"
                      :label="item.name"
                      :value="item.marketid"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col 
                :span="10">
                <el-form-item>
                  <el-button 
                    type="primary"
                    @click="search('adSearchForm')">搜索</el-button>
                  <el-button 
                    @click="resetSearch('adSearchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
       <!-- 表格 -->
        <el-table 
          ref="multipleTable"
          :data="data" 
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="ID"
          />
          <el-table-column
            prop="ar_user_name"
            label="账号名">
            <template slot-scope="scope">
              {{scope.row.ar_user.name}}
            </template>
          </el-table-column>
          <el-table-column
            prop="area"
            label="授权地区">
          <template slot-scope="scope">
              {{scope.row.market.area.name}}
            </template>
          </el-table-column>
          <el-table-column
            prop="market_name"
            label="授权场地">
          <template slot-scope="scope">
              {{scope.row.market.name}}
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期"
          />
        </el-table>
        <div 
          class="pagination-wrap">
          <el-pagination
            :total="pagination.total"
            :page-size="pagination.pageSize"
            :current-page="pagination.currentPage"
            layout="prev, pager, next, jumper, total"
            @current-change="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMarket, getPermissionsList } from 'service'

import {
  Button,
  MessageBox,
  Input,
  Table,
  Select,
  Option,
  Col,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  Row
} from 'element-ui'

export default {
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-input': Input,
    'el-pagination': Pagination,
    'el-form': Form,
    'el-select': Select,
    'el-option': Option,
    'el-form-item': FormItem,
    'el-col': Col,
    'el-row': Row
  },
  data() {
    return {
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      data: [],
      loading: false,
      marketList: [],
      searchLoading: false,
      adSearchForm: {
        market_id: ''
      },
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  created() {
    this.getPermissionsList()
    this.getMarket()
  },
  methods: {
    getMarket() {
      getMarket(this)
        .then(res => {
          this.marketList = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    getPermissionsList() {
      this.setting.loading = true

      let args = {
        include: 'ar_user,market.area',
        marketid: this.adSearchForm.market_id
      }
      if (!this.adSearchForm.market_id) {
        delete args.marketid
      }
      getPermissionsList(this, args)
        .then(res => {
          this.data = res.data
          this.pagination.total = res.meta.pagination.total
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
          console.log(err)
        })
    },
    search(formName) {
      this.pagination.currentPage = 1
      this.getPermissionsList()
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.getPermissionsList()
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
      this.getPermissionsList()
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
    .item-content-wrap {
      .icon-item {
        padding: 10px;
        width: 50%;
      }
      .search-wrap {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .search-form {
          width: 500px;
        }
        .el-form-item {
          margin-bottom: 10px;
        }
        .el-select {
          width: 200px;
        }
        .warning {
          background: #ebf1fd;
          padding: 8px;
          margin-left: 10px;
          color: #444;
          font-size: 12px;
          i {
            color: #4a8cf3;
            margin-right: 5px;
          }
        }
      }
      .actions-wrap {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .label {
          font-size: 14px;
        }
      }
      .pagination-wrap {
        margin: 10px auto;
        text-align: right;
      }
    }
  }
}
</style>
