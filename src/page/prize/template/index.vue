<template>
  <div
    v-loading="setting.loading"
    :element-loading-text="setting.loadingText"
    class="schedule-wrap"
  >
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-form 
        ref="searchForm" 
        :model="searchForm" 
        :inline="true">
        <el-form-item 
          label 
          prop="name">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入奖品模板名称"
            clearable
            class="el-search-input"
          >
            <i 
              slot="prefix" 
              class="el-input__icon el-icon-name el-icon-same"/>
          </el-input>
        </el-form-item>
        <el-button 
          class="el-button-success" 
          @click="search">搜索</el-button>
        <el-button 
          class="el-button-cancel" 
          @click="resetSearch('searchForm')">重置</el-button>
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

    <el-table 
      :data="tableData" 
      :header-cell-style="headerStyle" 
      style="width: 100%">
      <el-table-column 
        prop="id" 
        label="奖品模板ID" 
        min-width="100"/>
      <el-table-column 
        prop="name" 
        label="模版名称" 
        min-width="100"/>
      <el-table-column 
        label="操作" 
        min-width="100">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            @click="editPrizePolicy(scope.row)">编辑</el-button>
          <el-button 
            size="mini" 
            @click="childPrizePolicy(scope.row)">子条目</el-button>
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
    <!-- 新增，修改 -->
    <el-dialog 
      :title="title" 
      :visible.sync="templateVisible" 
      @close="dialogClose">
      <el-form 
        v-loading="loading" 
        ref="templateForm" 
        :model="templateForm" 
        label-width="150px">
        <el-form-item
          :rules="[{ type: 'string', required: true, message: '请输入模板名', trigger: 'submit' }]"
          label="模板名"
          prop="name"
        >
          <el-input 
            v-model="templateForm.name" 
            placeholder="请输入模板名" 
            class="item-submit-input"/>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            size="small" 
            @click="submit('templateForm')">完成</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPrizePolicyList,
  savePrizePolicy,
  modifyPrizePolicy
} from "service";
import {
  Form,
  FormItem,
  Button,
  Pagination,
  Table,
  TableColumn,
  Dialog,
  MessageBox,
  Input
} from "element-ui";

export default {
  components: {
    ElDialog: Dialog,
    ElPagination: Pagination,
    ElInput: Input,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElTable: Table,
    ElTableColumn: TableColumn
  },
  data() {
    return {
      headerStyle: { color: "#444" },
      templateVisible: false,
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      loading: false,
      title: "",
      templateForm: {
        pid: "",
        name: ""
      },
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      searchForm: {
        name: ""
      },
      tableData: []
    };
  },
  created() {
    this.getPrizePolicyList();
  },
  methods: {
    childPrizePolicy(item) {
      this.$router.push({
        path: "/prize/template/policy",
        query: {
          pid: item.id
        }
      });
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getPrizePolicyList();
    },
    editPrizePolicy(item) {
      this.title = "修改模板";
      let name = item.name;
      this.templateForm = {
        pid: item.id,
        name: name
      };
      this.templateVisible = true;
    },
    addPrizePolicy() {
      this.templateForm.name = this.templateForm.pid ="";
      this.templateVisible = true;
      this.title = "增加模板";
    },

    getPrizePolicyList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
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

    dialogClose() {
      this.templateVisible = false;
    },

    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let args = {
            name: this.templateForm.name
          };
          let id = this.templateForm.pid;
          if (this.templateForm.pid) {
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
    .el-search-input {
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
  .item-submit-input {
    width: 200px;
  }
  .item-input {
    width: 120px;
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
