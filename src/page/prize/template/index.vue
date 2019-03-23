<template>
  <div
    v-loading="setting.loading"
    :element-loading-text="setting.loadingText"
    class="schedule-wrap"
  >
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item label prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入奖品模板名称" clearable>
            <i slot="prefix" class="el-input__icon el-icon-name el-icon-same"></i>
          </el-input>
        </el-form-item>
        <el-button class="el-button-success" @click="search">搜索</el-button>
        <el-button class="el-button-cancel" @click="resetSearch('filters')">重置</el-button>
      </el-form>
    </div>
    <div class="actions-wrap">
      <span class="label">奖品模板列表 ( {{ pagination.total }} )</span>
      <!-- 模板增加 -->
      <div>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addPrizePolicy"
        >新增奖品模板</el-button>
      </div>
    </div>
    <!-- 模板奖品列表 -->
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item
        v-for="(item, index) in tableData"
        :name="index"
        :key="item.id"
        class="collapse-item-wrap"
      >
        <template slot="title">
          <span>{{ item.name }}&nbsp;&nbsp;</span>
          <!-- type="primary" -->
          <el-button icon="el-icon-edit" circle size="mini" @click="modifyTemplateName(item)"/>
        </template>
        <div class="actions-wrap">
          <span class="label">数目: {{ item.schedules.data.length }}</span>
          <div>
            <el-button size="small" @click="addSchedule(index)">增加</el-button>
          </div>
        </div>
        <el-table :data="item.schedules.data" style="width: 100%" :header-cell-style="headerStyle">
          <el-table-column prop="id" label="ID" width="100"/>
          <el-table-column prop label="公司名称" min-width="150">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.project.name"
                :loading="searchLoading"
                filterable
                placeholder="请选择公司名称"
                clearable
                style="width: 180px;"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop label="奖品名称" min-width="150">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.project.name"
                :loading="searchLoading"
                filterable
                placeholder="请选择奖品名称"
                clearable
                style="width: 180px;"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="icon" label="概率" min-width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.rate">
                <template slot="append">%</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.project.icon"
                size="mini"
                @click="editSchedule(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="!scope.row.project.icon"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteAddSchedule(index, scope.$index, scope.row)"
              />
              <el-button
                v-if="!scope.row.project.icon"
                size="mini"
                style="background-color: #8bc34a;border-color: #8bc34a; color: #fff;"
                @click="saveSchedule(scope.row)"
              >保存</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <div class="pagination-wrap">
      <el-pagination
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.currentPage"
        layout="prev, pager, next, jumper, total"
        @current-change="changePage"
      />
    </div>
    <!-- 新增，修改 -->
    <el-dialog :title="title" :visible.sync="templateVisible" @close="dialogClose">
      <el-form v-loading="loading" ref="templateForm" :model="templateForm" label-width="150px">
        <el-form-item
          :rules="[{ type: 'string', required: true, message: '请输入名称', trigger: 'submit' }]"
          label="模板名"
          prop="name"
        >
          <el-input v-model="templateForm.name" placeholder="请输入名称" class="item-input"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submit('templateForm')">完成</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCompanies,
  getProject,
  getPrizePolicyList,
  savePrizePolicy,
  modifyPrizePolicy,
  prizePolicyDetails
} from "service";
import {
  Form,
  FormItem,
  Button,
  Collapse,
  CollapseItem,
  Select,
  Option,
  Pagination,
  Table,
  TableColumn,
  Dialog,
  MessageBox,
  Input
} from "element-ui";

export default {
  components: {
    ElCollapse: Collapse,
    ElCollapseItem: CollapseItem,
    ElDialog: Dialog,
    ElPagination: Pagination,
    ElInput: Input,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElSelect: Select,
    ElOption: Option,
    ElTable: Table,
    ElTableColumn: TableColumn
  },
  data() {
    return {
      activeNames: 0,
      companyList: [],
      headerStyle: { color: "#444" },
      templateVisible: false,
      searchForm: {
        name: ""
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
      searchLoading: false,
      loading: false,
      title: "",
      templateForm: {
        tpl_id: "",
        name: ""
      },
      projectList: [],
      companyList: [],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      searchForm: {
        name: ""
      },
      tableData: [
        {
          id: 51,
          name: "闵行-汉翔书法",
          schedules: {
            data: [
              {
                id: 177,
                tpl_id: 51,
                date_start: "13:00",
                date_end: "16:00",
                project: {
                  alias: "hanXiangHw",
                  created_at: "2019-03-05 18:30:53",
                  icon: "http://image.exe666.com/1007/image/561_icon.jpg",
                  id: 439,
                  image: "http://image.exe666.com/1007/image/816_bg.png",
                  info: "汉翔书法",
                  link:
                    "http://cdn.exe666.com/1007/other/hanXiangHw_2019030116.apk",
                  name: "汉翔书法-颛桥万达",
                  operation: "秦洁莲",
                  policy_id: 69,
                  tester: "方圆,杨昀",
                  updated_at: "2019-03-05 18:30:53",
                  version_code: "2019030116",
                  versionname: "hanXiangHw"
                }
              },
              {
                id: 177,
                tpl_id: 51,
                date_start: "13:00",
                date_end: "16:00",
                project: {
                  alias: "hanXiangHw",
                  created_at: "2019-03-05 18:30:53",
                  icon: "http://image.exe666.com/1007/image/561_icon.jpg",
                  id: 439,
                  image: "http://image.exe666.com/1007/image/816_bg.png",
                  info: "汉翔书法",
                  link:
                    "http://cdn.exe666.com/1007/other/hanXiangHw_2019030116.apk",
                  name: "汉翔书法-颛桥万达",
                  operation: "秦洁莲",
                  policy_id: 69,
                  tester: "方圆,杨昀",
                  updated_at: "2019-03-05 18:30:53",
                  version_code: "2019030116",
                  versionname: "hanXiangHw"
                }
              }
            ]
          }
        },
        {
          id: 51,
          name: "闵行-汉翔书法",
          schedules: {
            data: [
              {
                id: 177,
                tpl_id: 51,
                date_start: "13:00",
                date_end: "16:00",
                project: {
                  alias: "hanXiangHw",
                  created_at: "2019-03-05 18:30:53",
                  icon: "http://image.exe666.com/1007/image/561_icon.jpg",
                  id: 439,
                  image: "http://image.exe666.com/1007/image/816_bg.png",
                  info: "汉翔书法",
                  link:
                    "http://cdn.exe666.com/1007/other/hanXiangHw_2019030116.apk",
                  name: "汉翔书法-颛桥万达",
                  operation: "秦洁莲",
                  policy_id: 69,
                  tester: "方圆,杨昀",
                  updated_at: "2019-03-05 18:30:53",
                  version_code: "2019030116",
                  versionname: "hanXiangHw"
                }
              },
              {
                id: 177,
                tpl_id: 51,
                date_start: "13:00",
                date_end: "16:00",
                project: {
                  alias: "hanXiangHw",
                  created_at: "2019-03-05 18:30:53",
                  icon: "http://image.exe666.com/1007/image/561_icon.jpg",
                  id: 439,
                  image: "http://image.exe666.com/1007/image/816_bg.png",
                  info: "汉翔书法",
                  link:
                    "http://cdn.exe666.com/1007/other/hanXiangHw_2019030116.apk",
                  name: "汉翔书法-颛桥万达",
                  operation: "秦洁莲",
                  policy_id: 69,
                  tester: "方圆,杨昀",
                  updated_at: "2019-03-05 18:30:53",
                  version_code: "2019030116",
                  versionname: "hanXiangHw"
                }
              }
            ]
          }
        }
      ]
    };
  },
  created() {
    this.getCompanies();
    this.getProject();
    // this.getPrizePolicyList()
  },
  methods: {
    resetSearch() {},
    modifyTemplateName(item) {
      this.loading = false;
      this.title = "修改模板";
      let name = item.name;
      this.templateForm = {
        tpl_id: item.id,
        name: name
      };
      this.templateVisible = true;
    },
    projectChangeHandle(pIndex, index, val) {
      this.tableData[pIndex].schedules.data[index].project.id = val;
    },
    editSchedule(row) {
      this.setting.loading = true;
      let id = row.id;
      let date_end = row.date_end;
      let date_start = row.date_start;
      let project_id = row.project.id;
      let args = {
        include: "project",
        project_id: project_id,
        date_end: date_end,
        date_start: date_start
      };
      modifySchedule(this, id, args)
        .then(response => {
          this.setting.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getPrizePolicyList();
        })
        .catch(err => {
          console.log(err);
          this.setting.loading = false;
        });
    },
    saveSchedule(row) {
      this.setting.loading = true;
      let date_end = row.date_end;
      let date_start = row.date_start;
      let tpl_id = row.tpl_id;
      let project_id = row.project.id;
      let args = {
        tpl_id: tpl_id,
        project_id: project_id,
        date_end: date_end,
        date_start: date_start
      };
      saveSchedule(this, args)
        .then(response => {
          this.setting.loading = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getPrizePolicyList();
        })
        .catch(err => {
          console.log(err);
          this.setting.loading = false;
        });
    },
    addPrizePolicy() {
      this.templateForm.name = "";
      this.templateForm.tpl_id = "";
      this.templateVisible = true;
      this.title = "增加模板";
    },
    deleteAddSchedule(pIndex, index, r) {
      this.tableData[pIndex].schedules.data.splice(index, 1);
    },
    getPrizePolicyList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        include: "company,batches.company",
        name: this.searchForm.name
      };
      getPrizePolicyList(this, args)
        .then(response => {
          this.tableData = response.data;
          this.pagination.total = response.meta.pagination.total;
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
    addSchedule(index) {
      let tpl_id = this.tableData[index].id;
      let td = {
        date_start: "",
        date_end: "",
        project: {
          id: "",
          info: "",
          icon: "",
          created_at: ""
        },
        tpl_id: tpl_id
      };
      this.tableData[index].schedules.data.push(td);
    },
    dialogClose() {
      this.templateVisible = false;
    },
    getProject() {
      this.searchLoading = true;
      getProject(this)
        .then(response => {
          this.projectList = response;
          this.searchLoading = false;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
          this.searchLoading = false;
        });
    },
    getCompanies() {
      this.searchLoading = true;
      getProject(this)
        .then(response => {
          this.companyList = response;
          this.searchLoading = false;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
          this.searchLoading = false;
        });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let args = {
            point_id: this.templateForm.point_id,
            name: this.templateForm.name
          };
          let id = this.templateForm.tpl_id;
          if (this.templateForm.tpl_id) {
            modifyPrizePolicy(this, id, args)
              .then(response => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.templateVisible = false;
                this.getPrizePolicyList();
              })
              .catch(err => {
                this.templateVisible = false;
                this.$message({
                  type: "warning",
                  message: err.response.data.message
                });
              });
          } else {
            savePrizePolicy(this, args)
              .then(response => {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.templateVisible = false;
                this.getPrizePolicyList();
              })
              .catch(err => {
                this.templateVisible = false;
                this.$message({
                  type: "warning",
                  message: err.response.data.message
                });
              });
          }
        }
      });
    },
    search() {
      this.pagination.currentPage = 1;
      this.getPrizePolicyList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getPrizePolicyList();
    }
  }
};
</script>
<style lang="less" scoped>
.schedule-wrap {
  background: #fff;
  padding: 30px;
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
  .item-input {
    width: 220px;
  }
  .item-select {
    width: 220px;
  }
  .el-button.is-circle {
    padding: 5px;
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
      font-size: 14px;
      font-weight: 600;
    }
  }
  .pagination-wrap {
    margin: 10px auto;
    text-align: right;
  }
}
</style>
