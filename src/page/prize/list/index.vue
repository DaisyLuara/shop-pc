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
              prop="name">
              <el-input 
                v-model="filters.name" 
                placeholder="请输入奖品名称" 
                clearable>
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-project el-icon-same"/>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button 
                class="el-button-success" 
                @click="search()">搜索</el-button>
              <el-button 
                class="el-button-cancel" 
                @click="resetSearch('filters')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">奖品列表（ {{ pagination.total }} ）</span>
          <el-button 
            type="primary" 
            icon="el-icon-circle-plus-outline" 
            @click="addPrize">新增奖品</el-button>
        </div>
        <!-- 列表 -->
        <el-table
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
                <el-form-item label="奖品ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="奖品名称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="剩余库存:">
                  <span>{{ scope.row.stock }}</span>
                </el-form-item>
                <el-form-item label="修改时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column 
            :show-overflow-tooltip="true" 
            sortable 
            prop="id" 
            label="奖品ID" 
            width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="name"
            label="奖品名称"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="stock"
            label="剩余库存"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="updated_at"
            label="修改时间"
            min-width="100"
          />
          <el-table-column 
            label="操作" 
            width="160">
            <template slot-scope="scope">
              <el-button 
                size="small" 
                @click="linkToEdit(scope.row)">编辑</el-button>
              <el-button 
                size="small" 
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
    </div>
  </div>
</template>
<script>
import { getCouponRulesList, deletePrize } from "service";
import {
  Button,
  Input,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox
} from "element-ui";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-input": Input,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem
  },
  data() {
    return {
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      loading: true,
      filters: {
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
      tableData: []
    };
  },
  created() {
    this.getCouponRulesList();
  },
  methods: {
    addPrize() {
      this.$router.push({
        path: "/prize/list/save"
      });
    },
    linkToEdit(currentCoupon) {
      this.$router.push({
        path: `/prize/list/edit/${currentCoupon.id}`
      });
    },
    getCouponRulesList() {
      this.setting.loading = true;
      let args = {
        include: "company,customer",
        page: this.pagination.currentPage,
        name: this.filters.name
      };
      if (this.filters.name === "") {
        delete args.name;
      }
      getCouponRulesList(this, args)
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
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getCouponRulesList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getCouponRulesList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getCouponRulesList();
    },
    deleteEntry(item) {
      this.$confirm("此操作将删除该条目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let id = item.id;
          deletePrize(this, id)
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getCouponRulesList();
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
      .icon-item {
        padding: 10px;
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
          width: 200px;
        }
        .item-input {
          width: 230px;
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
