<template>
  <div
    v-loading="setting.loading"
    :element-loading-text="setting.loadingText"
    class="ad-list-wrapper" >
    <div 
      class="actions-wrap">
      <span 
        class="label">
        广告总数: {{ pagination.total }}
      </span>
    </div>
    <!-- 搜索 -->
    <div 
      class="search-wrap">
      <el-form 
        :model="searchForm"
        ref="searchForm" 
        class="search-form">
        <el-row 
          :gutter="20">
          <el-col 
            :span="8">
            <el-form-item 
              label="" 
              prop="areaid" >
              <el-select 
                v-model="searchForm.areaid"
                placeholder="请选择区域"
                filterable 
                clearable>
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
              prop="title" >
              <el-input 
                v-model="searchForm.title" 
                placeholder="广告名称"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col 
            :span="8">
            <el-form-item 
              label=""
              prop="marketid" >
              <el-select 
                v-model="searchForm.marketid" 
                :loading="searchLoading"
                placeholder="请选择场地"   
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
        </el-row>
        <el-row
          :gutter="20">
          <el-col 
            :span="8">
            <el-form-item 
              label="" 
              prop="state" >
              <el-select 
                v-model="searchForm.state" 
                placeholder="状态" 
                clearable>
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col 
            :span="14">
            <el-form-item 
              label="" 
              prop="dateTime" >
              <el-date-picker
                v-model="searchForm.dateTime"
                :clearable="false"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :span="12">
          <el-col 
            :span="8">
            <el-form-item>
              <el-button 
                type="primary" 
                size="small"
                @click="searchHandle">搜索</el-button>
              <el-button 
                size="small"
                @click="resetSearch('searchForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="content-wrap">
      <div 
        class="actions-wrap">
        <el-button 
          type="success" 
          size="small" 
          icon="el-icon-plus"
          @click="addLink">新建广告</el-button>
        <!-- <el-button 
          type="primary" 
          size="small" 
          icon="el-icon-download"
          @click="getExcelData">下载列表</el-button> -->
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="table-wrap">
        <el-table-column 
          type="expand">
          <template 
            slot-scope="scope">
            <el-form 
              label-position="left" 
              inline 
              class="demo-table-expand">
              <el-form-item 
                label="ID">
                <span>{{ scope.row.id }}</span>
              </el-form-item>
              <el-form-item 
                label="投放人">
                {{ scope.row.ar_user.name }}
              </el-form-item>
              <el-form-item 
                label="广告名称">
                {{ scope.row.title }}
              </el-form-item>
              <el-form-item 
                label="场地">
                <span>
                  {{ scope.row.market.name }}
                </span>
              </el-form-item>
              <el-form-item 
                label="区域">
                <span>{{ scope.row.market.area.name }}</span>
              </el-form-item>
              <el-form-item 
                label="授权公司">
                {{ scope.row.weixin_auth.nick_name }}
              </el-form-item>
              <el-form-item 
                label="冠名次数">
                <span>{{ scope.row.playnum }}</span>
              </el-form-item>
              <el-form-item 
                label="当前冠名次数">
                <span>{{ scope.row.curplaynum }}</span>
              </el-form-item>
              <el-form-item 
                label="曝光次数">
                <span>{{ scope.row.looknum }}</span>
              </el-form-item>
              <el-form-item 
                label="当前曝光次数">
                <span>{{ scope.row.curlooknum }}</span>
              </el-form-item>
              <el-form-item 
                label="档期">
                  <span> {{ scope.row.sdate }} ~ {{ scope.row.edate }}</span>
              </el-form-item>
              <el-form-item 
                label="修改时间">
                <span>{{ scope.row.date }}</span>
              </el-form-item>
              <el-form-item 
                label="状态">
                  <span v-if="scope.row.state === 0">待审核</span>
                  <span v-if="scope.row.state === 1">通过</span>
                  <span v-if="scope.row.state === 2">失败</span>
                  <span v-if="scope.row.state === 3">失效</span>
                  <span v-if="scope.row.state === 4">已完成</span>
                  <span v-if="scope.row.state === 5">余额不足</span>
                  <span v-if="scope.row.state === 6">待校验</span>
              </el-form-item>
              <el-form-item 
                label="竖版视频/图片">
                <a
                  v-if="scope.row.purl !== null"
                  :href="scope.row.purl" 
                  target="_blank" 
                  style="color: blue">查看</a>
              </el-form-item>
              <el-form-item 
                label="横版视频/图片">
                <a 
                  v-if="scope.row.lurl !== null"
                  :href="scope.row.lurl" 
                  target="_blank" 
                  style="color: blue">查看</a>
              </el-form-item>
              <el-form-item 
                label="竖版logo">
                <a
                  v-if="scope.row.plogo !== null" 
                  :href="scope.row.plogo" 
                  target="_blank" 
                  style="color: blue">查看</a>
              </el-form-item>
              <el-form-item 
                label="横版logo">
                <a 
                  v-if="scope.row.llogo !== null" 
                  :href="scope.row.llogo" 
                  target="_blank" 
                  style="color: blue">查看</a>
              </el-form-item>
              <el-form-item 
                label="竖版文案">
                <a 
                  v-if="scope.row.pinfo !== null" 
                  :href="scope.row.pinfo" 
                  target="_blank" 
                  style="color: blue">查看</a>
              </el-form-item>
              <el-form-item 
                label="横版文案">
                <a 
                  v-if="scope.row.linfo !== null" 
                  :href="scope.row.linfo" 
                  target="_blank" 
                  style="color: blue">查看</a>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="title"
          label="广告名称"
          min-width="130"/>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="area"
          label="区域"
          min-width="90">
          <template slot-scope="scope">
            {{scope.row.market.area.name}}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="market"
          label="场地"
          min-width="130">
          <template slot-scope="scope">
            {{scope.row.market.name}}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="auth"
          label="授权公司"
          min-width="90">
          <template slot-scope="scope">
            {{scope.row.weixin_auth.nick_name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0">待审核</span>
            <span v-if="scope.row.state === 1">通过</span>
            <span v-if="scope.row.state === 2">失败</span>
            <span v-if="scope.row.state === 3">失效</span>
            <span v-if="scope.row.state === 4">已完成</span>
            <span v-if="scope.row.state === 5">余额不足</span>
            <span v-if="scope.row.state === 6">待校验</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop=""
          label="档期"
          min-width="130">
          <template slot-scope="scope">
            {{scope.row.sdate}} ~ {{scope.row.edate}}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="date"
          sortable
          label="修改时间"
          min-width="130"/>
        <el-table-column
          prop="playnum"
          label="冠名次数">
          <template slot-scope="scope">
            {{scope.row.curplaynum}}/{{scope.row.playnum}}
          </template>
        </el-table-column>
        <el-table-column
          prop="looknum"
          label="曝光次数">
          <template slot-scope="scope">
            {{scope.row.curlooknum}}/{{scope.row.looknum}}
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="80">
          <template 
            slot-scope="scope">
            <el-button 
              size="small" 
              type="success"
              @click="editAd(scope.row.id)">编辑</el-button>
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
</template>
<script>
import { getMarket, getAeraList } from 'service'
import ad from 'service/ad'
import utils from 'service/utils'
import {
  Row,
  Col,
  DatePicker,
  Select,
  Option,
  Button,
  Form,
  FormItem,
  MessageBox,
  Input,
  TableColumn,
  Table,
  Pagination
} from 'element-ui'

export default {
  components: {
    'el-table-column': TableColumn,
    'el-table': Table,
    'el-row': Row,
    'el-col': Col,
    'el-date-picker': DatePicker,
    'el-select': Select,
    'el-button': Button,
    'el-option': Option,
    'el-form-item': FormItem,
    'el-form': Form,
    'el-input': Input,
    'el-pagination': Pagination
  },
  data() {
    return {
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      tableData: [],
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
      searchForm: {
        state: '',
        areaid: '',
        marketid: '',
        title: '',
        dateTime: ''
      },
      areaList: [],
      marketList: [],
      searchLoading: false,
      stateList: [
        {
          label: '待审核',
          value: 0
        },
        {
          label: '通过',
          value: 1
        },
        {
          label: '失败',
          value: 2
        },
        {
          label: '失效',
          value: 3
        },
        {
          label: '已完成',
          value: 4
        },
        {
          label: '余额不足',
          value: 5
        },
        {
          label: '待校验',
          value: 6
        }
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  created() {
    this.getMarket()
    this.getAdList()
    this.getAreaList()
  },
  methods: {
    addLink() {
      this.$router.push({
        path: '/ad/list/add'
      })
    },
    getExcelData() {
      let args = {
        type: 'download'
      }
      return chart
        .getExcelData(this, args)
        .then(response => {
          const a = document.createElement('a')
          a.href = response
          a.download = 'download'
          a.click()
          window.URL.revokeObjectURL(response)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAdList() {
      this.setting.loading = true
      let args = {
        include: 'ar_user,market.area,weixin_auth',
        page: this.pagination.currentPage,
        title: this.searchForm.title,
        marketid: this.searchForm.marketid,
        areaid: this.searchForm.areaid,
        state: this.searchForm.state,
        sdate: this.searchForm.dateTime[0],
        edate: utils.handleDateTransform(this.searchForm.dateTime[1])
      }
      !this.searchForm.title ? delete args.title : args.title
      !this.searchForm.marketid ? delete args.marketid : args.marketid
      !this.searchForm.areaid ? delete args.areaid : args.areaid
      !this.searchForm.state ? delete args.state : args.state
      !this.searchForm.dateTime[0] ? delete args.sdate : args.sdate
      !this.searchForm.dateTime[1] ? delete args.edate : args.edate
      ad.getAdList(this, args)
        .then(res => {
          this.tableData = res.data
          this.pagination.total = res.meta.pagination.total
          this.setting.loading = false
        })
        .catch(err => {
          console.log(err)
          this.setting.loading = false
        })
    },
    getMarket() {
      this.searchLoading = true
      getMarket(this)
        .then(res => {
          this.marketList = res
          this.searchLoading = false
        })
        .catch(err => {
          console.log(err)
          this.searchLoading = false
        })
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
      this.getAdList()
    },
    editAd(id) {
      this.$router.push({
        path: '/ad/list/edit/' + id
      })
    },
    getAreaList() {
      return getAeraList(this)
        .then(response => {
          let data = response.data
          this.areaList = data
        })
        .catch(error => {
          console.log(error)
          this.setting.loading = false
        })
    },
    searchHandle() {
      this.getAdList()
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.getAdList()
    },
    handleDateTransform(valueDate) {
      let date = new Date(valueDate)
      let year = date.getFullYear() + '-'
      let mouth =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      let day =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ''
      return year + mouth + day
    }
  }
}
</script>
<style lang="less" scoped>
.ad-list-wrapper {
  background: #fff;
  padding: 15px 30px;
  .search-wrap {
    padding-top: 15px;
    background: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 16px;
    align-items: center;
    position: relative;
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-select {
      width: 200px;
    }
  }
  .content-wrap {
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
    .table-wrap {
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
    }
    .pagination-wrap {
      margin: 10px auto;
      text-align: right;
    }
  }
}
</style>

