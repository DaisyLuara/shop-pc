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
            :inline="true">
            <el-form-item 
              label 
              prop="project_id">
              <el-select
                v-model="filters.project_id"
                :loading="searchLoading"
                min-width="130"
                placeholder="请输入广告模板名称"
                filterable
                clearable
              >
                <i 
                  slot="prefix" 
                  class="el-icon-printer"/>
                <el-option
                  v-for="item in adTemplateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item 
              label 
              prop="oid">
              <el-select
                v-model="filters.show"
                :loading="searchLoading"
                placeholder="请选择节目"
                filterable
                clearable
              >
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-status el-icon-same"/>
                <el-option
                  v-for="item in showList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item 
              label 
              prop="oid">
              <el-select
                v-model="filters.point"
                :loading="searchLoading"
                placeholder="请选择点位"
                filterable
                clearable
              >
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-status el-icon-same"/>
                <el-option
                  v-for="item in pointList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item 
              label 
              prop="policy_name">
                <el-date-picker
                    v-model="filters.put_time"
                    type="datetime"
                    placeholder="请选择投放时间">
                    <i 
                    slot="prefix" 
                    class="el-input__icon el-icon-name el-icon-same"/>
                </el-date-picker>
            </el-form-item>
            <el-form-item 
              label 
              prop>
              <el-button 
                class="el-button-success" 
                @click="search('filters')">搜索</el-button>
              <el-button 
                class="el-button-cancel" 
                @click="resetSearch('filters')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">广告投放列表: ( {{ pagination.total }} )</span>
          <div>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="addAdmeterial"
            >新增广告素材</el-button>
          </div>
        </div>
        <!-- 广告投放列表 -->
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
                class="demo-table-expand">
                <el-form-item label="广告模版:">
                  <span>{{ scope.row.policy.name }}</span>
                </el-form-item>
                <el-form-item label="点位名称:">
                  <span>{{ scope.row.point.name }}</span>
                </el-form-item>
                <el-form-item label="节目名称:">
                  <span>{{ scope.row.project.name }}</span>
                </el-form-item>
                <el-form-item label="模版投放时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
                <el-form-item label="修改时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column 
            sortable 
            prop="id" 
            label="ID" 
            width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="policy_name"
            label="广告模版"
            width="100"
          >
            <template slot-scope="scope">{{ scope.row.policy.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="name"
            label="点位名称"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.point.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="icon"
            label="节目名称"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.project.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="updated_at"
            label="模版投放时间"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.updated_at }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="updated_at"
            label="修改时间"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.updated_at }}</template>
          </el-table-column>
          <el-table-column 
            label="操作" 
            width="250">
            <template slot-scope="scope">
              <el-button 
                size="small" 
                @click="editAdmeterial(scope.row)">编辑</el-button>
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
import { getLaunchadPutList, getAdList, getPoint, getShowList } from "service";
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
    "el-date-picker": DatePicker,
  },
  data() {
    return {
      searchLoading: false,
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      filters: {
        project_id: null,
        show: null,
        point: null,
        put_time: ""
      },
      adTemplateList: [],
      showList: [],
      pointList: [],
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
    this.getLaunchadPutList();
    this.getAdList();
    this.getPoint();
    this.getShowList();
  },
  methods: {
    getShowList() {
      this.searchLoading = true;
      getAdList(this)
        .then(res => {
          this.showList = res;
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
    addAdmeterial() {
      this.$router.push({
        path: "/put/adPut/save"
      });
    },
    editAdmeterial(data) {
      this.$router.push({
        path: "/put/adPut/edit/" + data.id
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
        show: this.filters.show,
        point: this.filters.point,
        put_time: this.filters.put_time,
      };
      if (!this.filters.project_id) {
        delete searchArgs.project_id;
      }
      if (!this.filters.show) {
        delete searchArgs.show;
      }
      if (!this.filters.point) {
        delete searchArgs.point;
      }
      if (this.filters.put_time === "") {
        delete searchArgs.put_time;
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
@imgurl: "https://cdn.xingstation.cn/ad_shop/img/";
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
