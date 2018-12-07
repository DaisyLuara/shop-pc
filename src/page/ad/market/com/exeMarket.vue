<template>
  <div 
    v-loading="setting.loading" 
    :element-loading-text="setting.loadingText" 
    class="item-content-wrap">
    <div 
      class="actions-wrap">
      <span 
        class="label">
        场地总数: {{ pagination.total }}
      </span>
    </div>
    <div 
      class="search-wrap">
      <el-form 
        ref="adSearchForm" 
        :model="adSearchForm" 
        class="search-form">
        <el-row 
          :gutter="20">
          <el-col 
            :span="8">
            <el-form-item 
              label="" 
              prop="areaid">
              <el-select 
                v-model="adSearchForm.areaid" 
                placeholder="请选择区域" 
                filterable
                clearable >
                <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col 
            :span="8">
            <el-form-item 
              label="" 
              prop="market_name">
              <el-input 
                v-model="adSearchForm.market_name" 
                placeholder="请搜索场地"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col 
            :span="8">
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
    <el-table 
      ref="exeTable"
      :data="data" 
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
      />
      <el-table-column
        prop="area"
        label="地区">
        <template slot-scope="scope">
          {{ scope.row.area.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="场地名称"
      />
      <el-table-column 
        label="操作" 
        width="280">
        <template 
          slot-scope="scope">
          <el-button 
            size="small" 
            type="success"
            @click="applyAuth(scope.row.id)">申请授权</el-button>
          <!-- <el-button 
            size="small" 
            type="warning"
            @click="removeAuth">解除授权</el-button> -->
        </template>
      </el-table-column>
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
</template>
<script>
import { getAeraList, getMarketExe, createPermission } from 'service'
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
      data: [],
      loading: true,
      marketList: [],
      searchLoading: false,
      adSearchForm: {
        areaid: '',
        market_name: ''
      },
      areaList: [],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      }
    }
  },
  created() {
    this.getMarketExe()
    this.getAreaList()
  },
  methods: {
    removeAuth() {
      this.$confirm('解除授权后, 您将不能使用该场地。确认要解除授权吗?', {
        confirmButtonText: '确定解除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btn-remove-custom-confirm',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '解除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解除'
          })
        })
    },
    applyAuth(marketid) {
      // const h = this.$createElement
      // MessageBox({
      //   message: h('p', null, [
      //     h(
      //       'div',
      //       { style: 'color: #444; font-size: 16px; margin-bottom: 15px;' },
      //       '缴纳押金（嗨币）'
      //     ),
      //     h('div', { style: 'color: #fd8709;font-size: 18px;' }, '¥ 2000.00')
      //   ]),
      //   showCancelButton: true,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   confirmButtonClass: 'btn-apply-custom-confirm',
      //   center: true
      // })
      //   .then(action => {
      //     this.$message({
      //       type: 'success',
      //       message: '申请成功!'
      //     })
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '取消申请'
      //     })
      //   })
      this.$confirm('确认要申请授权吗?', {
        confirmButtonText: '确定授权',
        cancelButtonText: '取消',
        confirmButtonClass: 'btn-apply-custom-confirm',
        type: 'warning'
      })
        .then(() => {
          this.createPermission(marketid)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消申请'
          })
        })
    },
    getMarketExe() {
      this.setting.loading = true
      let args = {
        include: 'area',
        page: this.pagination.currentPage,
        areaid: this.adSearchForm.areaid,
        market_name: this.adSearchForm.market_name
      }
      if (!this.adSearchForm.areaid) {
        delete args.areaid
      }
      if (!this.adSearchForm.market_name) {
        delete args.market_name
      }
      getMarketExe(this, args)
        .then(res => {
          this.data = res.data
          this.pagination.total = res.meta.pagination.total
          this.setting.loading = false
        })
        .catch(err => {
          console.log(err)
          this.setting.loading = false
        })
    },
    createPermission(marketid) {
      let args = {
        marketid: `${marketid}`
      }
      createPermission(this, args)
        .then(res => {
          this.$message({
            type: 'success',
            message: '申请成功!'
          })
          this.setting.loading = true
          this.getMarketExe()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAreaList() {
      getAeraList(this)
        .then(response => {
          let data = response.data
          this.areaList = data
        })
        .catch(error => {
          console.log(error)
          this.setting.loading = false
        })
    },
    search(formName) {
      this.pagination.currentPage = 1
      this.getMarketExe()
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.getMarketExe()
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
      this.getMarketExe()
    }
  }
}
</script>
<style lang="less" scoped>
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
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-select {
      width: 200px;
    }
    .el-input {
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
</style>

