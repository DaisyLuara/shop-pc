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
          <el-form
            ref="filters"
            :model="filters"
            :inline="true"
          >
            <el-form-item
              label
              prop="point_name"
            >
              <el-input
                v-model="filters.point_name"
                placeholder="请填写点位名称"
                clearable
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-name el-icon-same"
                />
              </el-input>
            </el-form-item>
            <el-form-item
              label
              prop="screen_status"
            >
              <el-select
                v-model="filters.screen_status"
                placeholder="请选择屏幕状态"
                filterable
                clearable
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-status el-icon-same"
                />
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-button
                class="el-button-success"
                @click="search('filters')"
              >搜索</el-button>
              <el-button
                class="el-button-cancel"
                @click="resetSearch('filters')"
              >重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">设备列表（ {{ pagination.total }} ）</span>
        </div>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          :row-style="{height:'70px'}"
          :header-cell-style="headerStyle"
          style="width: 100%"
          type="expand"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form
                label-position="left"
                inline
                class="demo-table-expand"
              >
                <el-form-item label="设备ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="节目名称:">
                  <span>{{ scope.row.project.name }}</span>
                </el-form-item>
                <el-form-item label="点位:">
                  <span>{{ scope.row.point.name }}</span>
                </el-form-item>
                <el-form-item label="场地名称:">
                  <span>{{ scope.row.point.site_name }}</span>
                </el-form-item>
                <el-form-item label="上次互动:">
                  <span>{{ scope.row.faceDate }}</span>
                </el-form-item>
                <el-form-item label="联网时间:">
                  <span>{{ scope.row.networkDate }}</span>
                </el-form-item>
                <el-form-item label="登录时间:">
                  <span>{{ scope.row.loginDate }}</span>
                </el-form-item>
                <el-form-item label="屏幕状态:">
                  <span :class="(scope.row.screenStatus === 0) ? 'sold-out-expand' : 'operating-expand'">{{ scope.row.screenStatus ===0 ? '关闭': '开启' }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="id"
            label="设备ID"
            width="90"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="project"
            label="节目名称"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.project.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="point"
            label="点位"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.point.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="market"
            label="场地名称"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.point.market.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="faceDate"
            label="上次互动"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="networkDate"
            label="联网时间"
            min-width="90"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="loginDate"
            label="登录时间"
            min-width="90"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="screenStatus"
            label="屏幕状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span :class="(scope.row.screenStatus === 0) ? 'sold-out' : 'operating'">{{ scope.row.screenStatus === 0 ? '关闭': '开启' }}</span>
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
import { getDeviceList } from "service";

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
    "el-select": Select,
    "el-option": Option,
    "el-input": Input
  },
  data() {
    return {
      filters: {
        screen_status: null,
        point_name: null
      },
      statusList: [
        {
          id: 0,
          name: "关闭"
        },
        {
          id: 1,
          name: "开启"
        }
      ],
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
    this.getDeviceList();
  },
  methods: {
    getDeviceList() {
      this.setting.loading = true;
      let {point_name,screen_status} = this.filters
      let args = {
        include: "point.market,project",
        page: this.pagination.currentPage,
        point_name: point_name,
        screen_status: screen_status
      };
      if (point_name === "") {
        delete args.point_name;
      }

      if (screen_status === '') {
        delete args.screen_status;
      }
      getDeviceList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getDeviceList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getDeviceList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getDeviceList();
    }
  }
};
</script>

<style lang="less" scoped>
@imgurl: "https://cdn.xingstation.cn/ad_shop/img/";
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
