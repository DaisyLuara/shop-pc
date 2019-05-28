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
              prop="atiid"
            >
              <el-select
                v-model="filters.atiid"
                :loading="searchLoading"
                :multiple-limit="1"
                :remote-method="getAdTemplate"
                placeholder="请选择广告模版"
                filterable
                multiple
                remote
                clearable
              >
                <el-option
                  v-for="item in adTemplateList"
                  :key="item.atiid"
                  :label="item.name"
                  :value="item.atiid"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label
              prop="piid"
            >
              <el-select
                v-model="filters.piid"
                :loading="searchLoading"
                placeholder="请选择节目"
                filterable
                clearable
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-status el-icon-same"
                />
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label
              prop="oid"
            >
              <el-select
                v-model="filters.oid"
                :loading="searchLoading"
                placeholder="请选择点位"
                filterable
                clearable
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-status el-icon-same"
                />
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
              prop
            >
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
          <span class="label">广告投放列表: ( {{ pagination.total }} )</span>
          <div>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="addAdmeterial"
            >新增广告投放</el-button>
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
                class="demo-table-expand"
              >
                <el-form-item label="广告模版:">
                  <span>{{ scope.row.template.name }}</span>
                </el-form-item>
                <el-form-item label="点位名称:">
                  <span>{{ scope.row.point.name }}</span>
                </el-form-item>
                <el-form-item label="节目名称:">
                  <span>{{ scope.row.project.name }}</span>
                </el-form-item>
                <el-form-item label="模版投放时间:">
                  <span>{{ scope.row.sdate }} - {{ scope.row.edate }}</span>
                </el-form-item>
                <el-form-item label="修改时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="aoid"
            label="ID"
            width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="scope.row.template.name"
            label="广告模版"
            width="100"
          >
            <template slot-scope="scope">{{ scope.row.template.name }}</template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="scope.row.point.name"
            label="点位名称"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.point.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="scope.row.project.name"
            label="节目名称"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.project.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="scope.row.end_date"
            label="修改时间"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.updated_at }}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="250"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                msg-father="scope.row"
                @click="editAdmeterial(scope.row)"
              >编辑</el-button>
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
import { getLaunchadPutList, getAdTemplate, getPoint, getProject } from "service";
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
        atiid: null,
        piid: null,
        oid: null,
        put_time: ""
      },
      //模板列表
      adTemplateList: [],
      //节目列表
      projectList: [],
      //点位列表
      pointList: [],
      //投放列表
      tableData: [],
      aoid: '',
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
    };
  },
  created() {
    this.getLaunchadPutList();
    this.init()
  },
  methods: {
    async init() {
      try {
        this.searchLoading = true
        let projectRes = await getProject(this)
        this.projectList = projectRes
        let pointRes = await getPoint(this)
        this.pointList = pointRes
        this.searchLoading = false
      } catch (e) {

      }
    },
    getAdTemplate(query) {
      if (query !== '') {
        this.searchLoading = true
        let args = {
          name: query
        }
        getAdTemplate(this, args).then(res => {
          this.adTemplateList = res
          this.searchLoading = false

        }).catch(err => {
          this.searchLoading = false
        })
      } else {
        this.adTemplateList = [];
      }
    },
    //广告投放列表
    getLaunchadPutList() {
      this.setting.loading = true;
      let searchArgs = {
        page: this.pagination.currentPage,
        include: "template,point,project",
        atiid: this.filters.atiid,
        piid: this.filters.piid,
        oid: this.filters.oid,
        start_dat: this.filters.start_dat
      };
      if (!this.filters.atiid) {
        delete searchArgs.atiid;
      }
      if (!this.filters.piid) {
        delete searchArgs.piid;
      }
      if (!this.filters.oid) {
        delete searchArgs.oid;
      }
      if (this.filters.start_dat === "") {
        delete searchArgs.start_dat;
      }
      getLaunchadPutList(this, searchArgs)
        .then(response => {
          this.tableData = response.data;
          this.pagination.total = response.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(error => {
          this.setting.loading = false;
          this.$message({
            type: "warning",
            message: error.response.data.message
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
        path: "/put/adPut/edit/" + data.aoid,
      });
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getLaunchadPutList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getLaunchadPutList();


    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getLaunchadPutList();
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
