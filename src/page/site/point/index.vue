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
            <el-form-item label prop="point_name">
              <el-input v-model="filters.point_name" placeholder="请填写点位名称" clearable>
                <i slot="prefix" class="el-input__icon el-icon-name"></i>
              </el-input>
            </el-form-item>
            <el-form-item label>
              <el-button class="el-button-success" @click="search('filters')">搜索</el-button>
              <el-button class="el-button-cancel" @click="resetSearch('filters')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">点位列表（ {{ pagination.total }} ）</span>
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
                <el-form-item label="点位名称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="区域:">
                  <span>{{ scope.row.area.name }}</span>
                </el-form-item>
                <el-form-item label="场地名称:">
                  <span>{{ scope.row.market.name }}</span>
                </el-form-item>
                <el-form-item label="运营状态:">
                  <span
                    :class="(scope.row.visiable === 0) ? 'sold-out-expand' : 'operating-expand'"
                  >{{ scope.row.visiable === 0 ? '下架':'运营中' }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column sortable prop="id" label="ID" width="80"/>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="name"
            label="点位名称"
            min-width="100"
          />
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="area"
            label="区域"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.area.name }}</template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="site_name"
            label="场地名称"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.market.name }}</template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="status"
            label="运营状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                :class="(scope.row.visiable === 0) ? 'sold-out-expand' : 'operating-expand'"
              >{{ scope.row.visiable === 0 ? '下架':'运营中' }}</span>
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
  Input
} from "element-ui";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-input": Input
  },
  data() {
    return {
      filters: {
        point_name: null
      },
      siteList: [],
      pointList: [],
      statusList: [],
      headerStyle: { background: "#6b3ec2", color: "#fff" },
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
    this.getPointList();
  },
  methods: {
    getPointList() {
      this.setting.loading = true;
      let args = {
        include: "market,area",
        page: this.pagination.currentPage,
        point_name: this.filters.point_name
      };
      if (!this.filters.point_name) {
        delete args.point_name;
      }
      getPointList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
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
@imgurl: "https://cdn.exe666.com/ad_shop/img/";
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
      .sold-out {
        background: #ff7696;
        color: #fff;
        font-weight: 600;
        padding: 10px;
        border-radius: 10px;
      }
      .operating {
        background: #05c99a;
        color: #fff;
        font-weight: 600;
        padding: 10px;
        border-radius: 10px;
      }
      .sold-out-expand {
        background: #ff7696;
        color: #fff;
        font-weight: 600;
        padding: 3px 5px;
        border-radius: 5px;
      }
      .operating-expand {
        background: #05c99a;
        color: #fff;
        font-weight: 600;
        padding: 3px 5px;
        border-radius: 5px;
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
        .el-icon-name {
          &:before {
            content: " ";
            display: inline-block;
            background: url("@{imgurl}name_icon.png") center center/100% auto
              no-repeat;
            width: 15px;
            height: 15px;
            position: absolute;
            top: 50%;
            left: 3%;
            transform: translateY(-50%);
          }
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
