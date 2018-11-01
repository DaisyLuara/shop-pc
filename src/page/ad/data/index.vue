<template>
  <div
    v-loading="setting.loading"
    :element-loading-text="setting.loadingText"
    class="point-data-wrapper" >
    <div 
      class="actions-wrap">
      <span 
        class="label">
        <span 
          class="point-title">
          点位名称: 大融城
        </span>
         <span 
          class="ad-title">
          广告名称: 大融城大融城大融城
        </span>
      </span>
    </div>
    <!-- 搜索 -->
    <div 
      class="search-wrap">
      <div>
        <el-form
          ref="searchForm"
          :inline ="true"
          :model="searchForm" 
          class="search-form">
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
          <el-form-item>
            <el-button 
              type="primary" 
              size="small"
              @click="searchHandle">搜索</el-button>
            <el-button 
              size="small"
              @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 主要图表部分 -->
    <div 
      v-loading="poepleCountFlag"
      class="content-wrapper">
      <ul
        class="btns-wrapper">
        <li 
          v-for="(item, key) in peopleCount" 
          v-if="item.index !== 'outnum'"
          :key="key">
          <a 
            :class="'btn color-'+ key" 
            @hover="handleHover(key)">
            <i class="title" >
              {{ item.display_name }}
            </i>
            <span  
              v-if="item.index === 'looknum'"
              class="count">
              {{ circleLooknum }}
            </span>
            <span 
              v-if="item.index === 'playernum7'"
              class="count" >
              {{ circlePlayernum7 }}
            </span>
            <span 
              v-if="item.index === 'playernum'"
              class="count">
              {{ circlePlayernum }}
            </span>
            <span 
              v-if="item.index === 'lovenum'"
              class="count" >
              {{ circleLovenum }}
            </span>
            <i 
              v-if="item.index === 'looknum'"
              class="right-arrow-icon">
              {{ playernum7DivideLookNum }}
            </i>
            <i
              v-if="item.index === 'playernum7'"
              class="right-arrow-icon">
              {{ playernumDivideLookNum }}
            </i>
            <i 
              v-if="item.index === 'playernum'"
              class="right-arrow-icon" >
              {{ lovenumDivideLookNum }}
            </i>
          </a>
        </li>
      </ul>
    </div>
    <!-- 年龄分布图 -->
    <div 
      v-loading="ageFlag"
      class="age-sex-wrapper" > 
      <div 
        class="sex-part">
        <chart 
          ref="pieChart"
          :options="pieChart" 
          auto-resize
          @click="onClick"
        />
      </div>
      <div 
        class="age-part">
        <chart
          ref="ageChart"
          :options="ageChart"
          auto-resize />
      </div>
    </div>
    <!-- 时间段与人数特征 -->
    <div  
      class="time-crowd-wrapper" > 
      <div 
        class="crowd-part">
        <chart
          ref="crowdChart"
          :options="timeAndCrowdChart"
          auto-resize />
      </div>
    </div>
    <!-- 弹窗for 性别细节 -->
    <div  
      v-loading="dialogLoading"
      v-show="shouldDialogShow"
      class="chart-dialog">
      <div 
        class="dialog-close"
        @click="handleDialogClose">
        关闭
      </div>
      <chart 
        ref="pieChart2"
        :options="sexAndAgeChart"
        auto-resize />
    </div>
  </div>
</template>
<script>
import chart from 'service/chart'
import { DatePicker, Button, Form, FormItem, MessageBox } from 'element-ui'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/markLine'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

export default {
  components: {
    'el-date-picker': DatePicker,
    'el-button': Button,
    'el-form-item': FormItem,
    'el-form': Form,
    chart: ECharts
  },
  data() {
    return {
      style: {
        chartFont: {
          fontSize: window.innerWidth / 80 + 'px'
        }
      },
      shouldDialogShow: false,
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      crowdFlag: true,
      timeAndCrowdChart: {
        title: {
          text: '时间段与人数走势',
          align: 'left'
        },
        color: ['#662D91', '#ED1E79'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['数量', '女'],
          align: 'left',
          left: 10,
          top: 30
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '4%'
        },
        xAxis: [
          {
            type: 'category',
            // data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            max: 100,
            min: 0,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4
            ]
          },
          {
            name: '女',
            type: 'line',
            yAxisIndex: 1,
            markLine: {
              data: [
                {
                  name: 'Y 轴值为 50 的水平线',
                  yAxis: 50
                }
              ]
            },
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2
            ]
          }
        ]
      },
      searchForm: {
        dateTime: [
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          new Date().getTime() - 3600 * 1000 * 24
        ]
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
              const end = new Date() - 3600 * 1000 * 24
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
      peopleCount: [0, 0, 0, 0],
      type: '',
      poepleCountFlag: false,
      shouldPicDialogShow: false,
      ageFlag: false,
      sexFlag: false,
      pieChart: {
        color: ['#0071BC', '#ED1E79'],
        title: {
          text: '用户渗透率',
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: 30,
          left: 0,
          data: ['女', '男']
        },
        series: [
          {
            label: {
              normal: {
                fontSize: 16,
                formatter: '{d}%',
                position: 'inner'
              }
            },
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: null,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      ageChart: {
        color: ['#0071BC', '#ED1E79'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(data) {
            let male = (
              parseInt(data[0].value) /
              (parseInt(data[0].value) + parseInt(data[1].value)) *
              100
            ).toFixed(2)
            let female = (
              parseInt(data[1].value) /
              (parseInt(data[0].value) + parseInt(data[1].value)) *
              100
            ).toFixed(2)
            return (
              data[0].axisValue +
              ': <br/>' +
              data[0].marker +
              data[0].seriesName +
              ':' +
              data[0].value +
              ' ' +
              male +
              '%<br/>' +
              data[1].marker +
              data[1].seriesName +
              ':' +
              data[1].value +
              ' ' +
              female +
              '%'
            )
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '男',
            type: 'bar',
            barGap: '30%',
            barWidth: '60%',
            stack: '总量',
            data: null
          },
          {
            name: '女',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: null
          }
        ]
      },
      sexAndAgeChart: {
        title: {
          text: '性别年龄分布'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          right: 10,
          top: 'bottom',
          bottom: 10,
          data: null
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: null,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      dialogLoading: false
    }
  },
  computed: {
    peopleCountLength: function() {
      return this.peopleCount.length
    },
    circleLooknum: function() {
      return this.peopleCount[0].count === null ? 0 : this.peopleCount[0].count
    },
    circlePlayernum7: function() {
      return this.peopleCount[1].count === null ? 0 : this.peopleCount[1].count
    },
    circlePlayernum: function() {
      return this.peopleCount[2].count === null ? 0 : this.peopleCount[2].count
    },
    circleLovenum: function() {
      return this.peopleCount[3].count === null ? 0 : this.peopleCount[3].count
    },
    playernum7DivideLookNum: function() {
      let result = (
        this.peopleCount[1].count /
        this.peopleCount[0].count *
        100
      ).toFixed(2)
      return result === 0 || result === NaN ? 0 : result + '%'
    },
    playernumDivideLookNum: function() {
      let result = (
        this.peopleCount[2].count /
        this.peopleCount[1].count *
        100
      ).toFixed(2)
      return result === 0 || result === NaN ? 0 : result + '%'
    },
    lovenumDivideLookNum: function() {
      let result = (
        this.peopleCount[3].count /
        this.peopleCount[2].count *
        100
      ).toFixed(2)
      return result === 0 || result === NaN ? 0 : result + '%'
    }
  },
  created() {
    this.setting.loading = true
    this.allPromise()
    this.setting.loading = false
  },
  methods: {
    handleDialogClose() {
      this.shouldDialogShow = false
    },
    searchHandle() {
      this.setting.loading = true
      this.allPromise()
    },
    resetSearch() {
      this.area_id = ''
      this.point_id = ''
      this.setting.loading = true
      this.allPromise()
    },
    allPromise() {
      this.getPeopleCount()
      this.getAge()
      this.getGender()
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
        })
        .catch(err => {
          this.poepleCountFlag = false
          console.log(err)
        })
    },
    getAge() {
      this.ageFlag = true
      let args = this.setArgs('4')
      return chart
        .getChartData(this, args)
        .then(response => {
          let chart = this.$refs.ageChart
          chart.mergeOptions({
            xAxis: {
              type: 'category',
              data: response.map(r => {
                return r.display_name
              })
            },
            series: [
              {
                name: '男',
                type: 'bar',
                stack: '总量',
                data: response.map(r => {
                  return r.count.male
                })
              },
              {
                name: '女',
                type: 'bar',
                stack: '总量',
                label: {
                  normal: {
                    show: true,
                    position: 'top',
                    color: '#000',
                    fontSize: 16,
                    formatter: function(data) {
                      let content = ''
                      let index = data.dataIndex
                      let singleSum = parseInt(
                        parseInt(response[index].count.female) +
                          parseInt(response[index].count.male)
                      )
                      let sum = 0
                      response.map(r => {
                        sum += parseInt(r.count.male) + parseInt(r.count.female)
                      })
                      let percent = (singleSum / sum * 100).toFixed(1) + '%'
                      return percent + '\n' + singleSum
                    }
                  }
                },
                data: response.map(r => {
                  return r.count.female
                })
              }
            ]
          })
          this.ageFlag = false
        })
        .catch(err => {
          this.ageFlag = false
          console.log(err)
        })
    },
    getGender() {
      this.sexFlag = true
      let args = this.setArgs('5')
      return chart
        .getChartData(this, args)
        .then(response => {
          let chart = this.$refs.pieChart
          chart.mergeOptions({
            series: [
              {
                data: [
                  {
                    name: '男',
                    value: response[1].count === null ? 0 : response[1].count,
                    selected: true
                  },
                  {
                    name: '女',
                    value: response[0].count === null ? 0 : response[0].count
                  }
                ]
              }
            ]
          })
          this.sexFlag = false
        })
        .catch(err => {
          this.sexFlag = false
          console.log(err)
        })
    },
    onClick(event, instance, echarts) {
      this.dialogLoading = true
      this.shouldDialogShow = true
      let args = this.setArgs('4')
      chart.getChartData(this, args).then(response => {
        let that = this
        let mergeChart = this.$refs.pieChart2
        mergeChart.mergeOptions({
          color:
            event.name === '男'
              ? [
                  '#B6CEF9',
                  '#92B5F9',
                  '#649DFA',
                  '#4188F1',
                  '#397AD8',
                  '#3269B8'
                ].reverse()
              : [
                  '#F38DD0',
                  '#F19AB9',
                  '#EF70A0',
                  '#E3508B',
                  '#CA477B',
                  '#AE3E6C'
                ].reverse(),
          legend: {
            data: response.map(r => {
              return r.display_name
            })
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: response.map(r => {
                return {
                  name: r.display_name,
                  value: event.name === '男' ? r.count.male : r.count.female
                }
              }),
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
        this.dialogLoading = false
      })
    },
    setArgs(id) {
      let args = {
        id: id,
        start_date: this.handleDateTransform(this.searchForm.dateTime[0]),
        end_date: this.handleDateTransform(
          new Date(this.searchForm.dateTime[1]).getTime()
        )
      }
      return args
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
    },
    handlePicShow() {
      this.shouldPicDialogShow = !this.shouldPicDialogShow
    }
  }
}
</script>
<style lang="less" scoped>
.point-data-wrapper {
  .chart-dialog {
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 600px;
    height: 620px;
    background-color: white;
    border: 1px solid black;
    .dialog-close {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
    }
    .echarts {
      margin-top: 10%;
      height: 90%;
      width: 100%;
    }
  }
  .pic-dialog {
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 600px;
    height: 700px;
    background-color: white;
    border: 1px solid black;
    .dialog-close {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
    }
    .looknum {
      position: absolute;
      width: 80%;
      left: 10%;
      z-index: 11;
      top: 31%;
      text-align: center;
      color: white;
      font-weight: 800;
    }
    .playernum7 {
      position: absolute;
      width: 80%;
      left: 10%;
      z-index: 11;
      top: 45.5%;
      text-align: center;
      color: white;
      font-weight: 800;
    }
    .playernum {
      position: absolute;
      width: 80%;
      left: 10%;
      z-index: 11;
      top: 62%;
      text-align: center;
      color: white;
      font-weight: 800;
    }
    .lovenum {
      position: absolute;
      width: 80%;
      left: 10%;
      z-index: 11;
      top: 77%;
      text-align: center;
      color: white;
      font-weight: 800;
    }
  }
  .search-wrap {
    padding: 30px;
    background: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 16px;
    align-items: center;
    position: relative;
    .more-pic {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .el-form-item {
      margin-bottom: 10px;
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
        padding-right: 95px;
        padding-top: 20px;
        padding-bottom: 10px;
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
        .arrow-icon {
          position: absolute;
          z-index: 2;
          top: 145px;
          left: 66px;
          width: 0;
          height: 0;
          border-width: 13px 10px;
          border-style: solid;
          &.color-0 {
            border-color: #0099ff #ffffff #ffffff #ffffff;
          }
          &.color-1 {
            border-color: #22b572 #ffffff #ffffff #ffffff;
          }
          &.color-2 {
            border-color: #f8b62d #ffffff #ffffff #ffffff;
          }
          &.color-3 {
            border-color: #e83828 #ffffff #ffffff #ffffff;
          }
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
          padding-left: 20px;
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
        .right-arrow-icon {
          position: absolute;
          z-index: 2;
          text-align: center;
          color: #fff;
          line-height: 34px;
          top: 63px;
          right: -90px;
          width: 82px;
          height: 34px;
          background: url('~assets/images/program/right-arrow.png') 50%
            no-repeat;
        }
      }
    }
    .chart-wrapper {
      padding-top: 30px;
      width: 100%;
      height: 800px;
    }
  }
  .actions-wrap {
    background: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 16px;
    padding: 15px 30px 0;
    align-items: center;
    .label {
      font-size: 14px;
      .point-title{
        display: inline-block;
        margin-right: 30px;
      }
    }
  }
  .age-sex-wrapper {
    margin-top: 15px;
    background-color: #fff;
    height: 600px;
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .sex-part {
      width: 25%;
      height: 100%;

      .echarts {
        height: 100%;
        width: 100%;
      }
    }
    .age-part {
      width: 72%;
      left: 3%;
      height: 100%;
    }
  }
  .time-crowd-wrapper {
    margin-top: 15px;
    background-color: #fff;
    height: 600px;
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .crowd-part {
      width: 100%;
      height: 100%;
      .echarts {
        height: 90%;
        width: 100%;
      }
    }
  }
  .echarts {
    height: 100%;
    width: 100%;
  }
}
</style>

