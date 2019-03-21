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
            <el-form-item label prop="project_name">
              <el-input v-model="filters.project_name" placeholder="请填写节目名称" clearable>
                <i slot="prefix" class="el-input__icon el-icon-project el-icon-same"></i>
              </el-input>
            </el-form-item>
            <el-form-item label prop>
              <el-button class="el-button-success" @click="search('filters')">搜索</el-button>
              <el-button class="el-button-cancel" @click="resetSearch('filters')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">节目数量: ( {{ pagination.total }} )</span>
          <div>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="addProjectPut"
            >新增节目投放</el-button>
          </div>
        </div>
        <!-- 节目投放列表 -->
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
                <el-form-item label="节目名称:">
                  <span>{{ scope.row.project.name }}</span>
                </el-form-item>
                <el-form-item label="点位:">
                  <span>{{ scope.row.point.market.area.name + scope.row.point.market.name + scope.row.point.name }}</span>
                </el-form-item>
                <el-form-item label="节目icon:">
                  <img :src="scope.row.project.icon" alt="image" style="width: 40%;">
                </el-form-item>
                <el-form-item label="时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column sortable prop="id" label="ID" width="80"/>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="name"
            label="节目名称"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.project.name }}</template>
          </el-table-column>
          <el-table-column sortable prop="icon" label="节目icon" min-width="100">
            <template slot-scope="scope">
              <img :src="scope.row.project.icon" alt class="icon-item">
            </template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="point"
            label="点位"
            min-width="100"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.point.market.area.name + scope.row.point.market.name + scope.row.point.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="updated_at"
            label="时间"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.updated_at }}</template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button size="small" @click="modifyEditName(scope.row)">更换节目</el-button>
              <el-button size="small" @click="modifyEditTime(scope.row)">更改时间</el-button>
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
      <!-- 节目名称修改 -->
      <el-dialog v-loading="loading" :visible.sync="editVisible" title="修改" :show-close="false">
        <el-form ref="projectForm" :model="projectForm" label-position="top">
          <el-form-item
            v-if="modifyOptionFlag.project"
            :rules="[{ required: true, message: '请选择节目', trigger: 'submit'}]"
            label="节目"
            prop="project_id"
          >
            <el-select
              class="modify-width"
              v-loading="searchLoading"
              v-model="projectForm.project_id"
              filterable
              placeholder="请选择节目"
              clearable
            >
              <i slot="prefix" class="el-input__icon el-icon-project el-icon-same"></i>
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="modifyOptionFlag.time"
            label="开始时间"
            prop="sdate"
            :rules="[{ required: true, message: '请选择开始时间', trigger: 'submit'}]"
          >
            <el-date-picker
              class="modify-width"
              v-model="projectForm.sdate"
              :editable="false"
              type="date"
              placeholder="选择开始时间"
            />
          </el-form-item>
          <el-form-item
            v-if="modifyOptionFlag.time"
            label="结束时间"
            prop="edate"
            :rules="[{ required: true, message: '请选择结束时间', trigger: 'submit'}]"
          >
            <el-date-picker
              class="modify-width"
              v-model="projectForm.edate"
              :editable="false"
              type="date"
              placeholder="选择结束时间"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="el-button-success" @click="submitModify('projectForm')">完成</el-button>
            <el-button class="el-button-cancel" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getLaunchProjectList, getProject, modifyLaunchProject } from "service";
import {
  Button,
  Input,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Form,
  FormItem,
  MessageBox,
  DatePicker,
  Select,
  Option
} from "element-ui";

export default {
  components: {
    "el-table": Table,
    "el-date-picker": DatePicker,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-input": Input,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-select": Select,
    "el-option": Option,
    "el-dialog": Dialog
  },
  data() {
    return {
      searchLoading: false,
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      filters: {
        project_name: null
      },
      editID: null,
      projectList: [],
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      loading: true,
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      editVisible: false,
      projectForm: {
        project_id: null,
        sdate: "",
        edate: ""
      },
      modifyOptionFlag: {
        project: false,
        time: false
      },
      tableData: []
    };
  },
  created() {
    this.getLaunchProjectList();
    this.getProject();
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
    addProjectPut() {
      this.$router.push({
        path: "/put/list/save"
      });
    },
    dialogClose() {
      if (!this.editVisible) {
        this.editCondition.conditionList = [];
        this.$refs.multipleTable.resetFields();
      }
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.editCondition.conditionList = [];
      this.getLaunchProjectList();
    },
    modifyEditName(data) {
      this.editID = data.id;
      this.editVisible = true;
      this.modifyOptionFlag.project = true;
      this.modifyOptionFlag.time = false;
    },
    cancel() {
      this.$refs["projectForm"].resetFields();
      this.editVisible = false;
    },
    modifyEditTime(data) {
      this.projectForm.sdate = data.start_date;
      this.projectForm.edate = data.end_date;
      this.editID = data.id;
      this.editVisible = true;
      this.modifyOptionFlag.time = true;
      this.modifyOptionFlag.project = false;
    },
    submitModify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let args = {};
          this.setting.loading = true;
          if (this.modifyOptionFlag.project) {
            args = {
              default_plid: this.projectForm.project_id
            };
          }
          if (this.modifyOptionFlag.time) {
            let edate =
              (new Date(this.projectForm.edate).getTime() +
                ((23 * 60 + 59) * 60 + 59) * 1000) /
              1000;
            args = {
              sdate: new Date(this.projectForm.sdate).getTime() / 1000,
              edate: edate
            };
          }
          return modifyLaunchProject(this, this.editID, args)
            .then(response => {
              this.setting.loading = false;
              this.$message({
                message: "更改成功",
                type: "success"
              });
              this.cancel();
              this.getLaunchProjectList();
            })
            .catch(err => {
              this.setting.loading = false;
              this.cancel();
              this.$message({
                message: err.response.data.message,
                type: "success"
              });
            });
        }
      });
    },
    getLaunchProjectList() {
      this.setting.loading = true;
      let searchArgs = {
        page: this.pagination.currentPage,
        include: "point.market.area,project",
        project_name: this.filters.project_name
      };
      if (!this.filters.project_name) {
        delete searchArgs.project_name;
      }
      getLaunchProjectList(this, searchArgs)
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
      this.getLaunchProjectList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getLaunchProjectList();
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
