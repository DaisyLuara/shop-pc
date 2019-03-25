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
            <el-form-item label prop="project_id">
              <el-select
                v-model="filters.project_id"
                :loading="searchLoading"
                placeholder="请选择节目"
                filterable
                clearable
              >
                <i slot="prefix" class="el-input__icon el-icon-porject el-icon-same"/>
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="oid">
              <el-select
                v-model="filters.oid"
                :loading="searchLoading"
                placeholder="请选择点位"
                filterable
                clearable
              >
                <i slot="prefix" class="el-input__icon el-icon-status el-icon-same"/>
                <el-option
                  v-for="item in pointList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="policy_name">
              <el-input v-model="filters.policy_name" placeholder="请填写奖品模版" clearable>
                <i slot="prefix" class="el-input__icon el-icon-name el-icon-same"/>
              </el-input>
            </el-form-item>
            <el-form-item label prop>
              <el-button class="el-button-success" @click="search('filters')">搜索</el-button>
              <el-button class="el-button-cancel" @click="resetSearch('filters')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">奖品投放列表: ( {{ pagination.total }} )</span>
          <div>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="addPrizeLaunch"
            >新增奖品投放</el-button>
          </div>
        </div>
        <!-- 奖品投放列表 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          type="expand"
          :row-style="{height:'70px'}"
          :header-cell-style="headerStyle"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="奖品模版:">
                  <span>{{ scope.row.policy.name }}</span>
                </el-form-item>
                <el-form-item label="点位名称:">
                  <span>{{ scope.row.point.name }}</span>
                </el-form-item>
                <el-form-item label="节目名称:">
                  <span>{{ scope.row.project.name }}</span>
                </el-form-item>
                <el-form-item label="更新时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column sortable prop="id" label="ID" width="80"/>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="policy_name"
            label="奖品模版"
            width="100"
          >
            <template slot-scope="scope">{{ scope.row.policy.name }}</template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="name"
            label="点位名称"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.point.name }}</template>
          </el-table-column>
          <el-table-column sortable prop="icon" label="节目名称" min-width="100">
            <template slot-scope="scope">{{ scope.row.project.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="updated_at"
            label="更新时间"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.updated_at }}</template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button size="small" @click="editPirzeLaunch(scope.row)">编辑</el-button>
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
import { getLaunchPirzeList, getPoint, getProject } from "service";
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
  Option
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
    "el-option": Option
  },
  data() {
    return {
      searchLoading: false,
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      filters: {
        project_id: null,
        oid: null,
        policy_name: ""
      },
      pointList: [],
      projectList: [],
      templateList: [],
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
    this.getLaunchPirzeList();
    this.getProject();
    this.getPoint();
  },
  methods: {
    getProject() {
      this.searchLoading = true;
      getProject(this)
        .then(res => {
          this.projectList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getPoint() {
      this.searchLoading = true;
      getPoint(this)
        .then(res => {
          this.pointList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    addPrizeLaunch() {
      this.$router.push({
        path: "/put/prize/save"
      });
    },
    editPirzeLaunch(data) {
      this.$router.push({
        path: "/put/prize/edit/" + data.id
      });
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getLaunchPirzeList();
    },
    getLaunchPirzeList() {
      this.setting.loading = true;
      let searchArgs = {
        page: this.pagination.currentPage,
        include: "point.market,project,policy",
        project_id: this.filters.project_id,
        oid: this.filters.oid,
        policy_name: this.filters.policy_name
      };
      if (!this.filters.project_id) {
        delete searchArgs.project_id;
      }
      if (!this.filters.oid) {
        delete searchArgs.oid;
      }
      if (this.filters.policy_name === "") {
        delete searchArgs.policy_name;
      }
      getLaunchPirzeList(this, searchArgs)
        .then(response => {
          this.tableData = response.data;
          this.pagination.total = response.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(error => {
          this.setting.loading = false;
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getLaunchPirzeList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getLaunchPirzeList();
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
    .el-select,
    .item-input,
    .el-input {
      width: 200px;
    }
    .modify-width {
      width: 300px;
    }

    background: #fff;
    padding: 30px;
    .item-content-wrap {
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
          width: 180px;
        }
        .item-input {
          width: 180px;
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
