<template>
  <div 
    v-loading="setting.loading" 
    :element-loading-text="setting.loadingText"
    class="root">
    <div 
      class="customer-list-wrap">
      <div 
        class="customer-content-wrap">
        <div 
          class="search-wrap">
          <el-form 
            ref="searchForm"
            :model="filters" 
            :inline="true">
            <el-form-item 
              label="" 
              prop="point">
              <el-select 
                v-model="filters.point" 
                multiple 
                placeholder="请选择">
                <el-option
                  v-for="item in pointList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item 
              label="" 
              prop="dataValue">
              <el-date-picker
                v-model="filters.dataValue"
                :default-value="filters.dataValue"
                :clearable="false"
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
            <el-form-item 
              label="" 
              prop="deal">
              <el-select 
                v-model="filters.deal" 
                placeholder="交易方式" 
                clearable>
                <el-option
                  v-for="item in dealWay"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-button  
              type="primary" 
              size="small"
              @click="search('searchForm')">搜索</el-button>
            <el-button 
              type="default" 
              size="small"
              @click="resetSearch('searchForm')">重置</el-button>
          </el-form>
        </div>
        <div 
          class="actions-wrap">
          <span 
            class="label">
            交易数量: {{ pagination.total }}
          </span>
        </div>
        <el-table 
          :data="dealList" 
          style="width: 100%">
          <el-table-column
            prop="name"
            label="账户名称"
          />
          <el-table-column
            prop="date"
            label="日期"
          />
          <el-table-column
            prop="deal"
            label="交易方式"
          />
          <el-table-column
            prop="deposit"
            label="存入"
          />
          <el-table-column
            prop="expend"
            label="支出"
          />
          <el-table-column
            prop="balance"
            label="余额"
          />
          <el-table-column
            prop="abstract"
            label="信息摘要"
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
  DatePicker
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
    'el-date-picker': DatePicker
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
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
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      pointList: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      dealWay: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '支付宝'
        },
        {
          value: 2,
          label: '微信'
        },
        {
          value: 3,
          label: '嗨币'
        }
      ],
      filters: {
        dataValue: [
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          new Date().getTime()
        ],
        deal: 0,
        point: []
      },
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      pagination: {
        total: 100,
        pageSize: 10,
        currentPage: 1
      },
      dealList: [
        {
          name: '苏宁',
          date: '2018-07-08',
          deal: '支付宝',
          deposit: '10.00',
          expend: '',
          balance: '10.00',
          abstract: '购买嗨币'
        },
        {
          name: '苏宁',
          date: '2018-07-08',
          deal: '嗨币',
          deposit: '',
          expend: '5.00',
          balance: '5.00',
          abstract: '购买xxx'
        }
      ]
    }
  },
  created() {},
  methods: {
    getCustomerList() {
      if (this.setting.loading == true) {
        return false
      }
      let pageNum = this.pagination.currentPage
      let args = {
        include: 'user',
        page: pageNum,
        name: this.filters.name
      }
      this.setting.loadingText = '拼命加载中'
      this.setting.loading = true
      return company
        .getCustomerList(this, args)
        .then(response => {
          this.setting.loading = false
          this.dealList = response.data
          this.pagination.total = response.meta.pagination.total
        })
        .catch(error => {
          this.setting.loading = false
        })
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
    },
    search(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.root {
  // padding: 10px;
  font-size: 14px;
  color: #5e6d82;
  .customer-list-wrap {
    background: #fff;
    padding: 30px;
    .customer-content-wrap {
      .el-form-item {
        margin-bottom: 0;
      }
      .actions-wrap {
        margin-top: 15px;
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
