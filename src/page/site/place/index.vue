<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="item-list-wrap"
    >
      <div class="item-content-wrap">
        <!-- 搜索 -->
        <div class="search-wrap">
          <el-form ref="filters" :model="filters" :inline="true">
            <el-form-item label prop="area_id">
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
            <el-form-item label prop="site_id">
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
            <el-form-item label>
              <el-button class="el-button-success" @click="search('filters')">搜索</el-button>
              <el-button class="el-button-cancel" @click="resetSearch('filters')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">场地列表（ {{ pagination.total }} ）</span>
        </div>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          :row-style="{height:'70px'}"
          type="expand"
          :header-cell-style="headerStyle"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="区域:">
                  <span>{{ scope.row.area }}</span>
                </el-form-item>
                <el-form-item label="场地名称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="点位数量:">
                  <span>{{ scope.row.num }}</span>
                </el-form-item>
                <el-form-item label="时间:">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column sortable prop="id" label="ID" width="80"/>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="area"
            label="区域"
            min-width="100"
          />
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="name"
            label="场地名称"
            min-width="100"
          />
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="num"
            label="点位数量"
            min-width="100"
          />
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="created_at"
            label="时间"
            min-width="100"
          />
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button class="point-btn" @click="pointList(scope.row)">点位</el-button>
            </template>
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
      headerStyle: { background: "#6b3ec2", color: "#fff" },
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
      tableData: [
        {
          id: 1,
          area: "服南",
          name: "福州仓山万达百货",
          num: 10,
          created_at: "2019-01-16 19:01:01"
        },
        {
          id: 2,
          area: "湖南",
          name: "福州仓山万达百货",
          num: 10,
          created_at: "2019-01-16 19:01:01"
        }
      ]
    };
  },
  created() {
    // this.getPointList();
  },
  methods: {
    pointList(data) {
      this.$router.push({
        path: "/site/point"
      });
    },
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
      .point-btn {
        background: #05c99a;
        color: #fff;
        border-color: #05c99a;
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
        margin: 20px 0;
        .label {
          color: #6b3dc4;
          font-size: 16px;
          font-weight: 600;
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
