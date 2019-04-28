<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="item-list-wrap"
    >
      <div class="item-content-wrap">
        <el-form 
          ref="verify" 
          :model="verify" 
          :inline="true">
          <el-form-item 
            label 
            prop="order_total">
            <el-input
              v-model="verify.order_total"
              size="large"
              placeholder="请输入订单金额"
              clearable
              class="verify-input"
            >
              <i 
                slot="prefix" 
                class="el-input__icon el-icon-money el-icon-same"/>
            </el-input>
          </el-form-item>
          <el-form-item 
            label 
            prop="code">
            <el-input 
              v-model="verify.code" 
              placeholder="请输入优惠券码" 
              clearable 
              class="verify-input">
              <i 
                slot="prefix" 
                class="el-input__icon el-icon-code el-icon-same"/>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              @click="verifyPrize">核销</el-button>
            <el-button 
              type="default" 
              @click="resetverifyPrize('verify')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="search-wrap">
          <el-form 
            ref="filters" 
            :model="filters" 
            :inline="true">
            <el-form-item 
              label 
              prop="customer_name">
              <el-input
                v-model="filters.customer_name"
                size="medium"
                placeholder="请输入核销人员"
                clearable
              >
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-user el-icon-same"/>
              </el-input>
            </el-form-item>
            <el-form-item 
              label 
              prop="coupon_batch_name">
              <el-input
                v-model="filters.coupon_batch_name"
                size="medium"
                placeholder="请输入奖品名称"
                clearable
              >
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-gift el-icon-same"/>
              </el-input>
            </el-form-item>
            <el-form-item 
              label 
              prop="status">
              <el-select
                v-model="filters.status"
                placeholder="请选择优惠券状态"
                clearable
                size="medium"
                class="coupon-form-select"
              >
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-status el-icon-same"/>
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item 
              label 
              prop="point_id">
              <el-select
                v-model="filters.point_id"
                :loading="searchLoading"
                placeholder="请选择点位"
                size="medium"
                filterable
                clearable
              >
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-project el-icon-same"/>
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
              prop="dateTime">
              <el-date-picker
                v-model="filters.dateTime"
                :clearable="false"
                :picker-options="pickerOptions"
                size="medium"
                type="datetimerange"
                align="right"
                unlink-panels
                start-placeholder="发放开始日期"
                end-placeholder="发放结束日期"
              />
            </el-form-item>
            <el-button 
              class="el-button-success" 
              @click="search('filters')">搜索</el-button>
            <el-button 
              class="el-button-cancel" 
              @click="resetSearch('filters')">重置</el-button>
          </el-form>
        </div>
        <el-table
          ref="multipleTable"
          :row-style="{height:'70px'}"
          :data="tableData"
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
                <el-form-item label="奖品码:">
                  <span>{{ scope.row.code }}</span>
                </el-form-item>
                <el-form-item label="奖品名称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="状态:">
                  <span v-if="scope.row.status===0">未领取</span>
                  <span 
                    v-if="scope.row.status===1" 
                    class="operating-expand">已使用</span>
                  <span v-if="scope.row.status===2">停用</span>
                  <span 
                    v-if="scope.row.status===3" 
                    class="sold-out-expand">未使用</span>
                </el-form-item>
                <el-form-item label="核销人:">
                  <span>{{ scope.row.customer !== undefined ? scope.row.customer.name : '' }}</span>
                </el-form-item>
                <el-form-item label="点位:">
                  <span>{{ scope.row.point !== undefined ? scope.row.point.name : '' }}</span>
                </el-form-item>
                <el-form-item label="有效期:">
                  <span>{{ scope.row.start_date + '--' + scope.row.end_date }}</span>
                </el-form-item>
                <el-form-item label="核销时间:">
                  <span>{{ scope.row.use_date }}</span>
                </el-form-item>
                <el-form-item label="发放时间:">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="code"
            label="奖品码"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="name"
            label="奖品名称"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="status"
            label="状态"
            min-width="80"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status===0">未领取</span>
              <span 
                v-if="scope.row.status===1" 
                class="operating">已使用</span>
              <span v-if="scope.row.status===2">停用</span>
              <span 
                v-if="scope.row.status===3" 
                class="sold-out">未使用</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="customer_name"
            label="核销人"
            min-width="100"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.customer !== undefined ? scope.row.customer.name : '' }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="point"
            label="点位"
            min-width="100"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.point !== undefined ? scope.row.point.name : '' }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="date"
            label="有效期"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.start_date + '--' + scope.row.end_date }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="use_date"
            label="核销时间"
            min-width="80"
          />
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
import {
  getPrizeVerifyList,
  verifyPrize,
  getPoint,
  handleDateTimesTransform,
  handleDateTransform
} from "service";
import moment from "moment";

import {
  Button,
  Input,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox,
  DatePicker,
  Option,
  Select
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
    "el-date-picker": DatePicker,
    "el-select": Select,
    "el-option": Option
  },
  data() {
    return {
      verify: {
        code: "",
        order_total: ""
      },
      searchLoading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date().getTime() - 3600 * 1000 * 24;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date() - 3600 * 1000 * 24;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date() - 3600 * 1000 * 24;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pointList: [],
      filters: {
        dateTime: [],
        status: "",
        customer_name: "",
        coupon_batch_name: "",
        point_id: ""
      },
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      statusList: [
        {
          id: 0,
          name: "未领取"
        },
        {
          id: 1,
          name: "已使用"
        },
        {
          id: 2,
          name: "停用"
        },
        {
          id: 3,
          name: "未使用"
        }
      ],
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
    this.getPrizeVerifyList();
    this.getPoint();
  },
  methods: {
    getPoint() {
      this.searchLoading = true;
      getPoint(this)
        .then(res => {
          this.pointList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: "warring"
          });
          this.searchLoading = false;
        });
    },
    verifyPrize() {
      this.$confirm("确定要核销, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.setting.loading = true;
          let args = {
            code: this.verify.code,
            order_total: this.verify.order_total
          };
          if (this.verify.order_total === "") {
            delete args.order_total;
          }
          verifyPrize(this, args)
            .then(res => {
              this.$message({
                message: "核销成功",
                type: "success"
              });
              this.getPrizeVerifyList();
            })
            .catch(err => {
              this.setting.loading = false;
              this.$message({
                message: err.response.data.message,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消核销"
          });
        });
    },
    setArgs() {
      let args = {
        include: "customer,couponBatch,point",
        page: this.pagination.currentPage,
        status: this.filters.status,
        coupon_batch_name: this.filters.coupon_batch_name,
        customer_name: this.filters.customer_name,
        point_id: this.filters.point_id,
        start_date: moment(this.filters.dateTime[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        end_date: moment(this.filters.dateTime[1]).format("YYYY-MM-DD HH:mm:ss")
      };
      !this.filters.dateTime[0] ? delete args.start_date : args.start_date;
      !this.filters.dateTime[1] ? delete args.end_date : args.end_date;
      if (this.filters.status === "") {
        delete args.status;
      }
      if (this.filters.customer_name === "") {
        delete args.customer_name;
      }
      if (this.filters.coupon_batch_name === "") {
        delete args.coupon_batch_name;
      }
      if (this.filters.point_id === "") {
        delete args.point_id;
      }
      return args;
    },
    getPrizeVerifyList() {
      this.setting.loading = true;
      let args = this.setArgs();
      getPrizeVerifyList(this, args)
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
      this.getPrizeVerifyList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getPrizeVerifyList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getPrizeVerifyList();
    }
  }
};
</script>

<style lang="less" scoped>
.root {
  font-size: 14px;
  color: #5e6d82;
  .item-input {
    width: 250px;
  }
  .item-list-wrap {
    background: #fff;
    padding: 30px;
    .item-content-wrap {
      .verify-wrap {
        margin-bottom: 20px;
        .verify-content {
          border: 1px solid #73a3d2;
          display: inline-block;
          padding: 5px 0;
          .border-none {
            width: 200px;
          }
          .border-left {
            border-left: 1px solid #73a3d2;
          }
        }
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
        margin-top: 10px;
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
        margin-bottom: 10px;
        .label {
          font-size: 14px;
        }
      }
      .edit-icon {
        color: #3c9fff;
        font-weight: 700;
      }
      .pagination-wrap {
        margin: 10px auto;
        text-align: right;
      }
    }
  }
}
</style>
