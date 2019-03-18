<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="item-list-wrap"
    >
      <div class="item-content-wrap">
        <div class="search-wrap">
          <el-form ref="filters" :model="filters" :inline="true">
            <el-form-item label prop="name">
              <el-select
                icon="el-icon-search"
                v-model="filters.area_id"
                placeholder="请选择区域"
                filterable
                clearable
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="status">
              <el-select
                icon="el-icon-search"
                v-model="filters.site_id"
                placeholder="请选择场地"
                filterable
                clearable
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="dateTime">
              <el-date-picker
                v-model="filters.dateTime"
                :clearable="false"
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <el-button class="el-button-success" @click="search('filters')">搜索</el-button>
            <el-button class="el-button-cancel" @click="resetSearch('filters')">重置</el-button>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">点位数量: {{ pagination.total }}</span>
        </div>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" type="expand">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="点位名称">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="位置">
                  <span>{{ scope.row.area.name + scope.row.market.name + scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="状态">
                  <span>{{ scope.row.device.screenStatus !== null ? (scope.row.device.screenStatus === 0 ? '关闭' : '开启') : '' }}</span>
                </el-form-item>
                <el-form-item label="上次互动">
                  <span>{{ scope.row.device.faceDate }}</span>
                </el-form-item>
                <el-form-item label="联网时间">
                  <span>{{ scope.row.device.networkDate }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="点位名称" min-width="100"/>
          <el-table-column :show-overflow-tooltip="true" prop="area" label="位置" min-width="100">
            <template
              slot-scope="scope"
            >{{ scope.row.area.name + scope.row.market.name + scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="faceDate"
            label="上次互动"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.device.faceDate }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="networkDate"
            label="联网时间"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.device.networkDate }}</template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="screenStatus"
            label="状态"
            min-width="80"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.device.screenStatus !== null ? (scope.row.device.screenStatus === 0 ? '关闭' : '开启') : '' }}</template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
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
import { getPointList } from "service";

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
} from "element-ui";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-input": Input,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-select": Select,
    "el-option": Option,
    "el-date-picker": DatePicker
  },
  data() {
    return {
      filters: {
        area_id: null,
        site_id: null,
        dateTime: []
      },
      siteList: [],
      areaList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date().getTime() - 3600 * 1000 * 24;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date() - 3600 * 1000 * 24;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date() - 3600 * 1000 * 24;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: []
    };
  },
  created() {
    // this.getPointList();
  },
  methods: {
    getPointList() {
      this.setting.loading = true;
      let args = {
        include: "device,market,area",
        page: this.pagination.currentPage,
        point_name: this.filters.name,
        screen_status: this.filters.status
      };
      if (this.filters.name === "" || this.filters.name === null) {
        delete args.point_name;
      }
      if (this.filters.status === "") {
        delete args.screen_status;
      }
      getPointList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.setting.loading = false;
        });
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getPointList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getPointList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getPointList();
    }
  }
};
</script>

<style lang="less" scoped>
.root {
  font-size: 14px;
  color: #5e6d82;
  .item-list-wrap {
    background: #fff;
    padding: 30px;
    .item-content-wrap {
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
          width: 250px;
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
      .pagination-wrap {
        margin: 10px auto;
        text-align: right;
      }
    }
  }
}
</style>
