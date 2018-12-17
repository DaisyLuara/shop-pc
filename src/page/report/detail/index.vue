<template>
  <div
    class="point-data-wrapper" >
      <!-- 搜索 -->
      <div 
        class="search-wrap">
        <el-form
          :inline="true" 
          ref="searchForm"
          :model="searchForm"
          class="search-form">
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
          <el-form-item 
            label="" 
            prop="date" >
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
      <PeopleNum 
        ref="peopleCount" 
        :searchForm="searchForm"/>
  </div>
</template>
<script>
import { getPoint } from 'service'
import PeopleNum from './com/people_num'

import { DatePicker, Select, Option, Button, Form, FormItem } from 'element-ui'

export default {
  components: {
    'el-date-picker': DatePicker,
    'el-select': Select,
    'el-button': Button,
    'el-option': Option,
    'el-form-item': FormItem,
    'el-form': Form,
    PeopleNum
  },
  data() {
    return {
      searchForm: {
        point_id: '',
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
          return (
            time.getTime() > Date.now() - 8.64e7 ||
            time.getTime() < new Date('2017/04/21').getTime()
          )
        }
      },
      pointList: [],
      searchLoading: false
    }
  },

  mounted() {
    this.$refs.peopleCount.allChartData()
    let that = this
    window.onresize = function() {
      that.$refs.peopleCount.handleChange()
    }
  },
  created() {
    this.getPoint()
  },
  methods: {
    getPoint() {
      getPoint(this)
        .then(res => {
          this.pointList = res
          this.searchLoading = false
        })
        .catch(err => {
          this.$message({
            type: 'warning',
            message: err.data.response.message
          })
          this.searchLoading = false
        })
    },
    searchHandle() {
      this.$refs.peopleCount.searchHandle()
    },
    resetSearch() {
      this.searchForm.point_id = ''
      this.searchForm.dateTime = [
        new Date().getTime() - 3600 * 1000 * 24 * 7,
        new Date().getTime() - 3600 * 1000 * 24
      ]
      this.$refs.peopleCount.resetSearch()
    }
  }
}
</script>
<style lang="less" scoped>
.point-data-wrapper {
  background: #fff;
  .search-wrap {
    padding: 30px;
    background: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 16px;
    align-items: center;
    position: relative;
    .search-form {
      width: 865px;
    }
    .more-pic {
      position: absolute;
      top: 10px;
      right: 10px;
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
}
</style>

