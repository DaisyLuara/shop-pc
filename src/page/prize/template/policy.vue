<template>
  <div
    v-loading="setting.loading"
    :element-loading-text="setting.loadingText"
    class="schedule-wrap"
  >
    <div class="actions-wrap">
      <span class="label">子条目列表 ( {{ pagination.total }} )</span>
      <div>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addPolicy"
        >新增条目</el-button>
      </div>
    </div>
    <el-table 
      :data="tableData" 
      :header-cell-style="headerStyle" 
      style="width: 100%">
      <el-table-column 
        prop="id" 
        label="ID" 
        min-width="100"/>
      <el-table-column 
        prop="company" 
        label="公司名称" 
        min-width="100">
        <template slot-scope="scope">{{ scope.row.company.name }}</template>
      </el-table-column>
      <el-table-column 
        prop="name" 
        label="奖品名称" 
        min-width="100"/>
      <el-table-column 
        prop="icon" 
        label="概率" 
        min-width="100">
        <template slot-scope="scope">{{ scope.row.pivot.rate }}</template>
      </el-table-column>
      <el-table-column 
        label="操作" 
        min-width="100">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            @click="editPolicy(scope.row)">编辑</el-button>
          <el-button 
            size="mini" 
            @click="deleteEntry(scope.row)">删除</el-button>
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
</template>
<script>
import {
  deletePrizePolicyEntry,
  savePrizePolicyEntry,
  modifyPrizePolicyEntry,
  prizePolicyEntryDetails,
  getCompanies,
  getPrizePolicyEntryList
} from "service";
import {
  Form,
  FormItem,
  Button,
  Pagination,
  Table,
  TableColumn,
  MessageBox
} from "element-ui";

export default {
  components: {
    ElPagination: Pagination,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElTable: Table,
    ElTableColumn: TableColumn
  },
  data() {
    return {
      headerStyle: { color: "#444" },
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      pid: null
    };
  },
  computed: {},
  created() {
    // this.getCompanies();
    this.pid = this.$route.query.pid;
    this.getPrizePolicyEntryList();
  },
  methods: {
    addPolicy() {
      this.$router.push({
        path: "/prize/template/add",
        query: {
          pid: this.pid
        }
      });
    },
    editPolicy(row) {
      this.$router.push({
        path: "/prize/template/edit/" + row.id,
        query: {
          pid: this.pid
        }
      });
    },
    deleteEntry(item) {
      this.$confirm("此操作将删除该条目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let id = item.id;
          let pid = this.pid;
          deletePrizePolicyEntry(this, pid, id)
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getPrizePolicyEntryList();
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.response.data.message
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editEntry(row, item) {
      this.setting.loading = true;
      let id = row.id;
      let pid = item.id;
      let coupon_batch_id = row.pivot.coupon_batch_id;
      let rate = row.pivot.rate;
      let args = {
        rate: rate,
        coupon_batch_id: coupon_batch_id
      };
      modifyPrizePolicyEntry(this, pid, id, args)
        .then(response => {
          this.setting.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getPrizePolicyEntryList();
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
          this.setting.loading = false;
        });
    },
    saveEntry(row) {
      this.setting.loading = true;
      let pid = row.pid;
      let coupon_batch_id = row.pivot.coupon_batch_id;
      let rate = row.pivot.rate;
      let args = {
        rate: rate,
        coupon_batch_id: coupon_batch_id
      };
      savePrizePolicyEntry(this, pid, args)
        .then(response => {
          this.setting.loading = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getPrizePolicyEntryList();
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
          this.setting.loading = false;
        });
    },
    getPrizePolicyEntryList() {
      this.setting.loading = true;
      let args = {
        include: "company",
        page: this.pagination.currentPage
      };
      getPrizePolicyEntryList(this, this.pid, args)
        .then(response => {
          console.log(response);
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
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getPrizePolicyEntryList();
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
