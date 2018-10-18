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
            :span="9">
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
        </el-row>
        <el-row 
          :gutter="20">
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
    <!-- 主要图表部分 -->
    <div 
      v-loading="poepleCountFlag"
      class="content-wrapper">
      <ul
        class="btns-wrapper">
        <li
          v-for="(item, key) in peopleCount" 
          :key="key">
          <div :class="'color-'+key">
            <div class="title-count">
              <div class="title">{{ item.name }}</div>
              <div class="day">
                <div class="yesterday">昨日 {{ item.yesterdayCount }}</div>
                <div>前日 {{ item.prevCount }}</div>
              </div>
            </div>
            <div class="count">{{ item.count }}</div>
          </div>
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
  MessageBox
} from 'element-ui'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/markLine'
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
    chart: ECharts
  },
  data() {
    return {
      searchForm: {
        area_id: '',
        market_id: '',
        point_id: '',
        dateTime: [
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          new Date().getTime() - 3600 * 1000 * 24
        ]
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
        ]
      },
    
      pointList: [],
      searchLoading: false,
      peopleCount: [
        {
          name: '大屏数量',
          count: 1000,
          yesterdayCount: 100,
          prevCount: 100
        },
        {
          name: '广告客户数量',
          count: 4,
          yesterdayCount: 4,
          prevCount: 2
        },
        {
          name: '广告数量',
          count: 27,
          yesterdayCount: 10,
          prevCount: 4
        },
        {
          name: '平均利润率',
          count: '12.5%',
          yesterdayCount: '15%',
          prevCount: '10%'
        },
        {
          name: '总收益',
          count: '1,600',
          yesterdayCount: '1.4k',
          prevCount: '1.2k'
        }
      ],
      type: '',
      poepleCountFlag: false,
      mainChart: {
        color: ['#f3aa13', '#930095'],
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
          data: ['总收益', '广告数量']
        },
        grid: [
          {
            left: 50,
            right: 50,
            height: '50%'
          },
          {
            left: 50,
            right: 50,
            top: '61%',
            height: '33%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            data: null
          },
          {
            // show: false,
            gridIndex: 1,
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            data: null,
            position: 'top'
          }
        ],
        yAxis: [
          {
            name: '金额',
            gridIndex: 0,
            type: 'value'
          },
          {
            name: '数量',
            inverse: true,
            gridIndex: 1,
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
    }
  },
  created() {
    this.setting.loading = true
    this.allPromise()
  },
  methods: {
    searchHandle() {
      this.setting.loading = true
      this.allPromise()
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.setting.loading = true
      this.allPromise()
    },
    allPromise() {
      // this.getPeopleCount()
      this.setting.loading = false
    },
    getPeopleCount() {
      this.poepleCountFlag = true
      let args = this.setArgs('6')
      return chart
        .getChartData(this, args)
        .then(response => {
          this.peopleCount = response
          this.type = 'looknum,playernum,lovenum,playernum7'
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
        point_id: this.searchForm.point_id
      }
      if (!this.point_id) {
        delete args.point_id
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
          data: ['总收益', '广告数量']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: res.map(r => {
              return r.display_name
            })
          },
          {
            show: false,
            gridIndex: 1,
            type: 'category',
            boundaryGap: false,
            data: res.map(r => {
              return r.display_name
            }),
            position: 'top'
          }
        ],
        series: [
          {
            symbol: 'circle',
            name: '总收益',
            type: 'line',
            areaStyle: { normal: {} },
            data: res.map(r => {
              return r.looknum
            })
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            name: '广告数量',
            type: 'line',
            lineStyle: {
              color: '#930095'
            },
            data: res.map(r => {
              return (r.playernum7 / r.looknum * 100).toFixed(2)
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
      li {
        padding-right: 30px;
        padding-top: 20px;
        padding-bottom: 10px;
      }
      .color-0 {
        border: 1px solid #1780ff;
        border-radius: 10px;
        padding: 15px;
        background: #1780ff;
        color: #fff;
      }
      .color-1 {
        border: 1px solid #27a958;
        border-radius: 10px;
        padding: 15px;
        background: #27a958;
        color: #fff;
      }
      .color-2 {
        border: 1px solid #930095;
        border-radius: 10px;
        padding: 15px;
        background: #930095;
        color: #fff;
      }
      .color-3 {
        border: 1px solid #de0010;
        border-radius: 10px;
        padding: 15px;
        background: #de0010;
        color: #fff;
      }
      .color-4 {
        border: 1px solid #f3aa12;
        border-radius: 10px;
        padding: 15px;
        background: #f3aa12;
        color: #fff;
      }
      .title-count {
        display: flex;
        flex-direction: row;
        .title {
          margin-right: 30px;
          font-weight: 600;
          font-size: 16px;
        }
        .day {
          font-size: 10px;
          .yesterday {
            margin-bottom: 5px;
          }
        }
      }
      .count {
        font-size: 35px;
        font-weight: 600;
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

