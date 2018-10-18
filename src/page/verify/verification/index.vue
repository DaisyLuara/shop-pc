<template>
  <div 
    class="root">
    <div  
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="item-list-wrap">
      <div 
        class="item-content-wrap">
        <div class="verify-wrap">
          <div class="verify-content">
            <el-select 
              v-model="verify.point"
              filterable
              clearable 
              size="small"
              placeholder="请选择门店" 
              class="border-none">
              <el-option label="餐厅名" value="1"></el-option>
              <el-option label="订单号" value="2"></el-option>
              <el-option label="用户电话" value="3"></el-option>
            </el-select>
            <el-input 
              v-model="verify.order"
              size="small"
              placeholder="请输入订单号"
              class="border-none border-left"/>
            <el-input 
              v-model="verify.coupon"
              size="small"
              placeholder="请输入优惠券码"
              class="border-none border-left"/>
          </div>
          <el-button 
            type="primary">验证</el-button>
        </div>
        <h2>
          核销订单列表
        </h2>
        <div 
          class="search-wrap">
          <el-form 
            ref="filters"
            :model="filters" 
            :inline="true">
            <el-form-item 
              label="" 
              prop="point">
              <el-select 
                v-model="filters.point" 
                placeholder="门店" 
                filterable 
                clearable >
                <el-option
                  v-for="item in pointList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item 
              label="" 
              prop="project">
              <el-select 
                v-model="filters.project" 
                placeholder="节目" 
                filterable 
                clearable >
                <el-option
                  v-for="item in projetList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item 
              label="" 
              prop="dateTime" >
              <el-date-picker
                v-model="filters.dateTime"
                :default-value="filters.dateTime"
                :clearable="false"
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
            <el-button
              type="warning" 
              @click="search('filters')">搜索</el-button>
            <el-button 
              type="default"
              @click="resetSearch('filters')" >重置</el-button>
          </el-form>
        </div>
        <div 
          class="actions-wrap">
          <span 
            class="label">
            合计核销优惠券: {{ pagination.total }} 
          </span>
        </div>
        <el-table 
          ref="multipleTable" 
          :data="tableData" 
          style="width: 100%" 
          type="expand">
          <el-table-column 
            type="expand">
            <template 
              slot-scope="scope">
              <el-form 
                label-position="left" 
                inline 
                class="demo-table-expand">
                <el-form-item label="优惠券码">
                  <span>{{ scope.row.coupon_id }}</span>
                </el-form-item>
                <el-form-item label="订单">
                  <span>{{ scope.row.order_id }}</span>
                </el-form-item>
                <el-form-item label="门店ID">
                  <span>{{ scope.row.point_id }}</span>
                </el-form-item>
                <el-form-item 
                  label="门店名称">
                  <span>
                    {{ scope.row.point_name }}
                  </span>
                </el-form-item>
                <el-form-item 
                  label="节目名称">
                  <span>{{ scope.row.project_name }}</span>
                </el-form-item>
                <el-form-item 
                  label="优惠券详情">
                  <span>{{ scope.row.coupon_name }}</span>
                </el-form-item>
                <el-form-item 
                  label="核销时间">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
                <el-form-item 
                  label="核销方式">
                  <span>{{ scope.row.status }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="coupon_id"
            label="优惠券码"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="order_id"
            label="订单"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="point_id"
            label="门店ID"
            min-width="100">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="point_name"
            label="门店名称"
            min-width="100">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="project_name"
            label="节目名称"
            min-width="100">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="coupon_name"
            label="优惠券详情"
            min-width="80">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="created_at"
            label="核销时间"
            min-width="80">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="status"
            label="核销方式"
            min-width="80">
          </el-table-column>
          <el-table-column 
          label="操作" 
          width="80">
          <template 
            slot-scope="scope">
            <i 
              class="el-icon-edit-outline edit-icon"
              @click="dialogFormVisible = true"/>
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
    </div>
    <el-dialog title="核销修改" :visible.sync="dialogFormVisible">
      <el-form :model="orderForm">
        <el-form-item label="优惠券码" label-width="80">
          <span>2018080808</span>
        </el-form-item>
        <el-form-item label="订单号" label-width="80">
          <el-input v-model="orderForm.order" class="item-input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProject } from 'service'

import {
  Button,
  Input,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox,
  Select,
  Option,
  DatePicker,
  Dialog
} from 'element-ui'

export default {
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-input': Input,
    'el-pagination': Pagination,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-select': Select,
    'el-option': Option,
    'el-date-picker': DatePicker,
    'el-dialog': Dialog
  },
  data() {
    return {
      verify: {
        order: '',
        coupon: '',
        point: ''
      },
      orderForm: {
        order: ''
      },
      dialogFormVisible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date().getTime() - 3600 * 1000 * 24
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date() - 3600 * 1000 * 24
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date() - 3600 * 1000 * 24
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate: time => {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      filters: {
        point: '',
        project: '',
        dateTime: [
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          new Date().getTime() - 3600 * 1000 * 24
        ]
      },
      projetList: [],
      pointList: [],
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      pagination: {
        total: 2,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [
        {
          coupon_id: 2018080808,
          order_id: 20180930123001,
          point_id: 102567,
          point_name: '巴拉巴拉',
          project_name: '欢度国庆-鞭炮',
          coupon_name: '精美文具礼盒',
          created_at: '2018-09-30  12:30',
          status: '填写券码'
        },
        {
          coupon_id: 2018080809,
          order_id: 20180930123011,
          point_id: 102568,
          point_name: '棒约翰',
          project_name: '欢度国庆-鞭',
          coupon_name: '汤姆熊币',
          created_at: '2018-09-30  12:30',
          status: '扫二维码'
        }
      ]
    }
  },
  created() {
    this.getProject()
  },
  methods: {
    getProject() {
      getProject(this)
        .then(res => {
          this.projetList = res
        })
        .catch(err => {
          console.dir(err)
        })
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.pagination.currentPage = 1
    },
    search(formName) {
      this.pagination.currentPage = 1
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
    }
  }
}
</script>

<style lang="less" scoped>
.root {
  font-size: 14px;
  color: #5e6d82;
  .item-input {
    width: 200px;
  }
  .item-list-wrap {
    background: #fff;
    padding: 30px;
    .item-content-wrap {
      .verify-wrap {
        margin-bottom: 20px;
        .verify-content {
          border: 1px solid #73a3d2;
          display: inline-block;
          padding: 5px 0;
          .border-none {
            width: 200px;
          }
          .border-left {
            border-left: 1px solid #73a3d2;
          }
        }
      }
      .icon-item {
        padding: 10px;
        width: 60%;
      }
      .demo-table-expand {
        font-size: 0;
      }
      .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
      }
      .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
      }

      .search-wrap {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .el-form-item {
          margin-bottom: 0;
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
      .edit-icon {
        color: #3c9fff;
        font-weight: 700;
      }
      .pagination-wrap {
        margin: 10px auto;
        text-align: right;
      }
    }
  }
}
</style>
