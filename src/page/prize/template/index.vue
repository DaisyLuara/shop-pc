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
          <el-input
            v-model="searchForm.name"
            placeholder="请输入奖品模板名称"
            clearable
            class="el-search-input"
          >
            <i slot="prefix" class="el-input__icon el-icon-name el-icon-same"/>
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
          <el-button icon="el-icon-edit" circle size="mini" @click="modifyTemplateName(item)"/>
        </template>
        <div class="actions-wrap">
          <span class="label">数目: {{ item.batches.data.length }}</span>
          <div>
            <el-button size="small" @click="addSchedule(index)">增加</el-button>
          </div>
        </div>
        <el-table :data="item.batches.data" style="width: 100%" :header-cell-style="headerStyle">
          <el-table-column prop="id" label="ID" width="100"/>
          <el-table-column prop label="公司名称" min-width="150">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.company.id"
                :loading="searchLoading"
                filterable
                placeholder="请选择公司名称"
                clearable
                @change="companyChangeHandle(index,$index)"
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
                v-model="scope.row.pivot.coupon_batch_id"
                :loading="searchLoading"
                filterable
                placeholder="请选择奖品名称"
                clearable
              >
                <el-option
                  v-for="item in batchesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="icon" label="概率" min-width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.pivot.rate" class="item-input">
                <template slot="append">%</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button v-if="scope.row.id" size="mini" @click="editEntry(scope.row,item)">编辑</el-button>
              <el-button v-if="scope.row.id" size="mini" @click="deleteEntry(scope.row,item)">删除</el-button>
              <el-button
                v-if="!scope.row.id"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteAddSchedule(index, scope.$index, scope.row)"
              />
              <el-button
                v-if="!scope.row.id"
                size="mini"
                style="background-color: #8bc34a;border-color: #8bc34a; color: #fff;"
                @click="saveEntry(scope.row)"
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
          :rules="[{ type: 'string', required: true, message: '请输入模板名', trigger: 'submit' }]"
          label="模板名"
          prop="name"
        >
          <el-input v-model="templateForm.name" placeholder="请输入模板名" class="item-submit-input"/>
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
  deletePrizePolicyEntry,
  savePrizePolicyEntry,
  modifyPrizePolicyEntry,
  prizePolicyEntryDetails,
  getCompanies,
  getPrizePolicyList,
  savePrizePolicy,
  modifyPrizePolicy,
  getCouponBatches,
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
        pid: "",
        name: ""
      },
      batchesList: [],
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
          id: 10,
          name: "接口测试1111",
          created_at: "2019-03-22  14:26:24",
          updated_at: "2019-03-22  14:27:10",
          batches: {
            data: [
              {
                id: 82,
                name: "一点点总店(商户通用)",
                description: "",
                image_url: "",
                amount: 10,
                count: 1000,
                stock: 996,
                people_max_get: 1,
                pmg_status: 0,
                day_max_get: 1,
                dmg_status: 0,
                is_fixed_date: 1,
                delay_effective_day: 0,
                effective_day: 0,
                start_date: "2019-01-24  00:45:01",
                end_date: "2019-04-07  00:45:08",
                is_active: 1,
                third_code: "",
                pivot: {
                  policy_id: 10,
                  coupon_batch_id: 82,
                  rate: 100,
                  min_age: 0,
                  max_age: 0,
                  max_score: 0,
                  min_score: 0,
                  gender: 0,
                  type: "rate",
                  id: 34
                },
                wx_user_id: null,
                type: 1,
                redirect_url: "",
                created_at: "2019-03-21  02:27:07",
                updated_at: "2019-03-23  14:35:56",
                company: {
                  id: 6,
                  name: "颛桥万达",
                  internal_name: null,
                  address: "颛桥万达",
                  status: 1,
                  description: null,
                  logo: "",
                  created_at: "2018-09-05  11:10:10",
                  updated_at: "2018-09-05  11:10:10"
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
    // this.getPrizePolicyList()
  },
  methods: {
    resetSearch() {},
    modifyTemplateName(item) {
      this.loading = false;
      this.title = "修改模板";
      let name = item.name;
      this.templateForm = {
        pid: item.id,
        name: name
      };
      this.templateVisible = true;
    },
    companyChangeHandle(pIndex, index) {
      let company_id = this.tableData[pIndex].batches.data[index].company_id.id;
      this.getCouponBatches(company_id);
    },
    deleteEntry(row, item) {
      this.$confirm("此操作将删除该条目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let id = row.id;
          let pid = item.id;
          deletePrizePolicyEntry(this, pid, id)
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getPrizePolicyList();
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
      let company_id = row.company.id;
      let coupon_batch_id = row.pivot.id;
      let rate = row.pivot.rate;
      let args = {
        rate: rate,
        coupon_batch_id: coupon_batch_id,
        company_id: company_id
      };
      modifyPrizePolicyEntry(this, pid, id, args)
        .then(response => {
          this.setting.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getPrizePolicyList();
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
      let company_id = row.company.id;
      let coupon_batch_id = row.pivot.id;
      let rate = row.pivot.rate;
      let args = {
        rate: rate,
        coupon_batch_id: coupon_batch_id,
        company_id: company_id
      };
      savePrizePolicyEntry(this, pid, args)
        .then(response => {
          this.setting.loading = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getPrizePolicyList();
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
          this.setting.loading = false;
        });
    },
    addPrizePolicy() {
      this.templateForm.name = "";
      this.templateForm.pid = "";
      this.templateVisible = true;
      this.title = "增加模板";
    },
    deleteAddSchedule(pIndex, index, r) {
      this.tableData[pIndex].batches.data.splice(index, 1);
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
      let pid = this.tableData[index].id;
      let td = {
        id: null,
        company: {
          id: ""
        },
        pivot: {
          id: "",
          rate: 0
        },
        pid: pid
      };
      this.tableData[index].batches.data.push(td);
    },
    dialogClose() {
      this.templateVisible = false;
    },
    getCouponBatches(company_id) {
      this.searchLoading = true;
      let args = {
        company_id: company_id
      };
      getCouponBatches(this)
        .then(response => {
          this.batchesList = response;
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
      getCompanies(this)
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
