<template>
  <div
    v-loading="setting.loading"
    :element-loading-text="setting.loadingText"
    class="point-data-wrapper" >
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
              prop="project_id" >
              <el-select 
                v-model="searchForm.project_id" 
                :loading="searchLoading" 
                filterable 
                placeholder="请选择节目" 
                clearable>
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.alias"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col 
            :span="8">
            <el-form-item 
              label="" 
              prop="market_id" >
              <el-select 
                v-model="searchForm.market_id" 
                :loading="searchLoading"
                placeholder="请选择场地" 
                filterable 
                clearable
                @change="handleMarket">
                <el-option
                  v-for="item in marketList"
                  :key="item.marketid"
                  :label="item.name"
                  :value="item.marketid"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col 
            :span="8">
            <el-form-item 
              label=""
              prop="point_id" >
              <el-select 
                v-model="searchForm.point_id" 
                :loading="searchLoading"
                placeholder="请选择点位"   
                filterable 
                clearable>
                <el-option
                  v-for="item in pointList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row 
          :gutter="20">
          <el-col 
            :span="14">
            <el-form-item 
              label="" 
              prop="dateTime" >
              <el-date-picker
                v-model="searchForm.dateTime"
                :default-value="searchForm.dateTime"
                :clearable="false"
                :picker-options="pickerOptions2"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
          <el-col 
            :span="10">
            <el-form-item>
              <el-button 
                type="primary" 
                size="small"
                @click="searchHandle('searchForm')">搜索</el-button>
              <el-button 
                size="small"
                @click="resetSearch('searchForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 主要图表部分 -->
    <div 
      v-loading="poepleCountFlag"
      class="content-wrapper">
      <ul
        class="btns-wrapper">
        <li 
          v-for="(item, key) in peopleCount" 
          :key="key">
          <el-tooltip class="item" effect="dark" :content="tooltipContent(key)" placement="top">
            <a 
              :class="'btn color-'+ key">
              <i class="title" >
                {{ item.display_name }}
              </i>
              <span 
                v-if="item.index === 'playtimes15'"
                class="count" >
                {{ circlePlaytimes15 }}
              </span>
               <span  
                v-if="item.index === 'outnum'"
                class="count">
                {{ circleOutnum }}
              </span>
              <span 
                v-if="item.index === 'omo_outnum'"
                class="count" >
                {{ circleOmoOutnum }}
              </span>
            </a>
          </el-tooltip>
          <span class="hint" v-if="item.index === 'playtimes15'">🌟根据该维度计费</span>
        </li>
      </ul>
      <div 
        class="chart-wrapper">
        <chart 
          ref="mainChart"
          :options="mainChart" 
          auto-resize />
      </div>
    </div>
  </div>
</template>
<script>
import { getProject, getMarket, getPoint } from 'service'
import chart from 'service/chart'
import Vue from 'vue'

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
  Tooltip
} from 'element-ui'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/markLine'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

export default {
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-date-picker': DatePicker,
    'el-select': Select,
    'el-button': Button,
    'el-option': Option,
    'el-form-item': FormItem,
    'el-form': Form,
    'el-tooltip': Tooltip,
    chart: ECharts
  },
  data() {
    return {
      style: {
        chartFont: {
          fontSize: window.innerWidth / 80 + 'px'
        }
      },
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      pickerOptions2: {
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

      marketList: [],
      pointList: [],
      searchForm: {
        project_id: '',
        dateTime: [
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          new Date().getTime() - 3600 * 1000 * 24
        ],
        market_id: '',
        point_id: ''
      },
      searchLoading: false,
      projectList: [],
      peopleCount: [0, 0, 0],
      type: '',
      poepleCountFlag: false,
      projectAlias: '',
      mainChart: {
        color: ['#0099FF', '#22b572', '#F8B62D'],
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['大屏15s玩家人次', '二维码生成数', 'OMO有效跳转数']
        },
        grid: [
          {
            left: 50,
            right: 50,
            height: '50%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            data: null
          }
        ],
        yAxis: [
          {
            gridIndex: 0,
            type: 'value'
          }
        ],
        series: []
      }
    }
  },
  computed: {
    peopleCountLength: function() {
      return this.peopleCount.length
    },
    circlePlaytimes15: function() {
      return this.peopleCount[0].count === null ? 0 : this.peopleCount[0].count
    },
    circleOutnum: function() {
      return this.peopleCount[1].count === null ? 0 : this.peopleCount[1].count
    },
    circleOmoOutnum: function() {
      return this.peopleCount[2].count === null ? 0 : this.peopleCount[2].count
    }
  },
  created() {
    this.setting.loading = true
    this.allPromise()
    this.getMarket()
    this.getProject()
  },
  methods: {
    tooltipContent(key) {
      switch (key) {
        case 0:
          return '连续有效互动时间达到15秒计1个人次'
          break
        case 1:
          return '大屏二维码生成数'
          break
        case 2:
          return '大屏扫码发生跳转的总人数'
          break
        default:
          return ''
          break
      }
    },
    handleMarket() {
      this.getPoint()
    },
    getMarket() {
      let args = {
        include: 'market'
      }
      getMarket(this, args)
        .then(res => {
          this.marketList = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    getPoint() {
      let args = {
        market_id: this.searchForm.market_id
      }
      this.searchLoading = true
      getPoint(this, args)
        .then(response => {
          this.pointList = response
          this.searchLoading = false
        })
        .catch(err => {
          this.searchLoading = false
          console.log(err)
        })
    },
    searchHandle() {
      this.projectAlias = this.searchForm.project_id
      this.setting.loading = true
      this.allPromise()
    },
    resetSearch(formName) {
      this.setting.loading = true
      this.$refs[formName].resetFields()
      this.projectAlias = ''
      this.allPromise()
    },
    projectChangeHandle() {
      this.projectAlias = this.searchForm.project_id
    },
    allPromise() {
      this.getPeopleCount()
      this.setting.loading = false
    },
    getProject() {
      this.searchLoading = true
      getProject(this)
        .then(response => {
          this.projectList = response
          this.searchLoading = false
        })
        .catch(err => {
          console.log(err)
          this.searchLoading = false
        })
    },
    getPeopleCount() {
      this.poepleCountFlag = true
      let args = this.setArgs('6')
      return chart
        .getChartData(this, args)
        .then(response => {
          this.peopleCount = response
          this.type = 'playtimes15,outnum,omo_outnum'
          this.getLineData()
        })
        .catch(err => {
          this.poepleCountFlag = false
          console.log(err)
        })
    },
    setArgs(id) {
      let args = {
        id: id,
        start_date: this.handleDateTransform(this.searchForm.dateTime[0]),
        end_date: this.handleDateTransform(
          new Date(this.searchForm.dateTime[1]).getTime()
        ),
        alias: this.projectAlias,
        market_id: this.searchForm.market_id,
        point_id: this.searchForm.point_id
      }
      if (!this.projectAlias) {
        delete args.alias
      }
      if (!this.searchForm.point_id) {
        delete args.point_id
      }
      if (!this.searchForm.market_id) {
        delete args.market_id
      }
      return args
    },
    getLineData() {
      this.poepleCountFlag = true
      let args = this.setArgs('7')
      args.index = this.type
      return chart
        .getChartData(this, args)
        .then(response => {
          let dataLine = []
          let chart = this.$refs.mainChart
          chart.mergeOptions(this.processChartData(response))
          this.poepleCountFlag = false
        })
        .catch(err => {
          this.poepleCountFlag = false
          console.log(err)
        })
    },
    processChartData(res) {
      let newOption = {
        legend: {
          data: ['大屏15s玩家人次', '二维码生成数', 'OMO有效跳转数']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: res.map(r => {
              return r.display_name
            })
          }
        ],
        series: [
          {
            symbol: 'circle',
            name: '大屏15s玩家人次',
            type: 'line',
            areaStyle: { normal: {} },
            data: res.map(r => {
              return r.playtimes15
            })
          },
          {
            symbol: 'circle',
            name: '二维码生成数',
            type: 'line',
            areaStyle: { normal: {} },
            data: res.map(r => {
              return r.outnum
            })
          },
          {
            symbol: 'circle',
            name: 'OMO有效跳转数',
            type: 'line',
            areaStyle: { normal: {} },
            data: res.map(r => {
              return r.omo_outnum
            })
          }
        ]
      }
      return newOption
    },
    lineDataHandle(obj) {
      this.type = obj.index
      this.getLineData()
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
.point-data-wrapper {
  .search-wrap {
    padding: 30px;
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

  .content-wrapper {
    padding: 15px;
    background-color: #fff;
    .btns-wrapper {
      min-height: 170px;
      padding: 10px 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 10px;
      padding-left: 20px;
      li {
        padding-right: 30px;
        padding-top: 20px;
        padding-bottom: 10px;
        .hint {
          display: inline;
          font-size: 14px;
          color: #222;
        }
      }

      .btn {
        &.color-0 {
          background: url('~assets/images/program/circle.png') center 39px
            no-repeat #0099ff;
          background-size: 80px;
        }
        &.color-1 {
          background: url('~assets/images/program/circle.png') center 39px
            no-repeat #22b572;
          background-size: 80px;
        }
        &.color-2 {
          background: url('~assets/images/program/circle.png') center 39px
            no-repeat #f8b62d;
          background-size: 80px;
        }
        &.color-3 {
          background: url('~assets/images/program/circle.png') center 39px
            no-repeat #e83828;
          background-size: 80px;
        }
        &.color-4 {
          background: url('~assets/images/program/circle.png') center 39px
            no-repeat #4846b5;
          background-size: 80px;
        }
        cursor: pointer;
        width: 130px;
        height: 130px;
        display: block;
        border-radius: 5px;
        background: url('~assets/images/program/circle.png') center 35px
          no-repeat #f6f6f6;
        position: relative;

        .title {
          display: block;
          height: 35px;
          padding-left: 10px;
          padding-top: 9px;
          font-size: 14px;
          color: white;
          font-weight: 600;
          font-style: normal;
        }
        .count {
          display: block;
          text-align: center;
          height: 30px;
          padding-top: 40px;
          font-size: 15px;
          color: #517ebb;
        }
      }
    }
    .chart-wrapper {
      padding-top: 30px;
      width: 100%;
      height: 800px;
    }
  }
  .echarts {
    height: 100%;
    width: 100%;
  }
}
</style>

