<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="item-list-wrap"
    >
      <div style="margin: 0 10px 10px;font-size: 18px;">{{ customer_name }}</div>
      <div class="item-content-wrap">
        <div class="verify-wrap">
          <div class="verify-content">
            <el-input
              v-model="verify.order_total"
              size="small"
              placeholder="请输入订单金额"
              class="border-none"
            />
            <el-input
              v-model="verify.code"
              size="small"
              placeholder="请输入优惠券码"
              class="border-none border-left"
            />
          </div>
          <el-button type="primary" @click="verifyCoupon">验证</el-button>
          <el-button type="default" @click="resetverifyCoupon">重置</el-button>
        </div>
        <h2>核销订单列表</h2>
        <div class="search-wrap">
          <el-form ref="filters" :model="filters" :inline="true">
            <el-form-item label prop="dateTime">
              <el-date-picker
                v-model="filters.dateTime"
                :clearable="false"
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="核销开始日期"
                end-placeholder="核销结束日期"
              />
            </el-form-item>
            <el-form-item label prop="status">
              <el-select
                v-model="filters.status"
                placeholder="请选择优惠券状态"
                clearable
                class="coupon-form-select"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="shop_customer_id">
              <el-select
                v-model="filters.shop_customer_id"
                placeholder="请搜索核销人员"
                :loading="searchLoading"
                filterable
                clearable
                class="coupon-form-select"
              >
                <el-option
                  v-for="item in shopCustomerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="coupon_batch_id">
              <el-select
                v-model="filters.coupon_batch_id"
                :loading="searchLoading"
                placeholder="请选择优惠详情"
                filterable
                clearable
              >
                <el-option
                  v-for="item in couponList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="point_id">
              <el-select
                v-model="filters.point_id"
                :loading="searchLoading"
                placeholder="请选择点位"
                filterable
                clearable
              >
                <el-option
                  v-for="item in pointList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-button type="warning" @click="search('filters')">搜索</el-button>
            <el-button type="default" @click="resetSearch('filters')">重置</el-button>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">合计核销优惠券: {{ pagination.total }}</span>
        </div>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" type="expand">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="优惠券码">
                  <span>{{ scope.row.code }}</span>
                </el-form-item>
                <el-form-item label="订单">
                  <span>{{ scope.row.order_no }}</span>
                </el-form-item>
                <el-form-item label="订单金额">
                  <span>{{ scope.row.order_total }}</span>
                </el-form-item>
                <el-form-item label="订单图片">
                  <a :href="scope.row.media" target="_blank" style="color: blue">查看</a>
                </el-form-item>
                <el-form-item label="优惠券详情">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="核销时间">
                  <span>{{ scope.row.use_date }}</span>
                </el-form-item>
                <el-form-item label="核销时间">
                  <span>{{ scope.row.effect_start_date ? (scope.row.effect_start_date +'-'+ scope.row.effect_end_date) : '' }}</span>
                </el-form-item>
                <el-form-item label="核销人">
                  <span>{{ scope.row.customer !== undefined ? scope.row.customer.name : '' }}</span>
                </el-form-item>
                <el-form-item label="点位">
                  <span>{{ scope.row.point !== undefined ? scope.row.point.market.area.name + '-' + scope.row.point.market.name + '-' + scope.row.point.name : '' }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="code" label="优惠券码" min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="order_total"
            label="订单金额"
            min-width="80"
          />
          <el-table-column :show-overflow-tooltip="true" prop="name" label="优惠券详情" min-width="100"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status===0">未领取</span>
              <span v-if="scope.row.status===1">已使用</span>
              <span v-if="scope.row.status===2">停用</span>
              <span v-if="scope.row.status===3">未使用</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="核销人" min-width="100">
            <template
              slot-scope="scope"
            >{{ scope.row.customer !== undefined ? scope.row.customer.name : '' }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="point" label="点位" min-width="100">
            <template
              slot-scope="scope"
            >{{ scope.row.point !== undefined ? scope.row.point.market.area.name + '-'+ scope.row.point.market.name + '-'+ scope.row.point.name : '' }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="use_date"
            label="核销时间"
            min-width="80"
          ></el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <i class="el-icon-edit-outline edit-icon" @click="editHandle(scope.row)"/>
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
    <el-dialog title="核销修改" :visible.sync="dialogFormVisible">
      <el-form :model="orderForm">
        <el-form-item label="优惠券码" label-width="80">
          <span>{{orderForm.code}}</span>
        </el-form-item>
        <el-form-item label="订单号" label-width="80">
          <el-input v-model="orderForm.order_no" class="item-input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyCoupon">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCouponList,
  verifyCoupon,
  modifyCoupon,
  getCouponBatches,
  getCustomer,
  getPoint
} from "service";
import utils from "service/utils";

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
  Dialog,
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
    "el-dialog": Dialog,
    "el-select": Select,
    "el-option": Option
  },
  data() {
    return {
      verify: {
        // order_no: '',
        code: "",
        order_total: ""
      },
      orderForm: {
        code: "",
        order_no: ""
      },
      searchLoading: false,
      dialogFormVisible: false,
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
        shop_customer_id: "",
        coupon_batch_id: "",
        point_id: ""
      },
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
      shopCustomerList: [],
      couponList: [],
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      customer_name: "",
      tableData: []
    };
  },
  created() {
    this.getCouponList();
    let coustomer_info = JSON.parse(localStorage.getItem("customer_info"));
    this.customer_name = coustomer_info.name;
    this.getCustomer();
    this.getPoint();
    this.getCouponBatches();
  },
  methods: {
    getPoint() {
      getPoint(this)
        .then(res => {
          this.pointList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.searchLoading = false;
        });
    },
    getCouponBatches() {
      this.searchLoading = true;
      getCouponBatches(this)
        .then(res => {
          this.couponList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.searchLoading = false;
        });
    },
    getCustomer() {
      this.searchLoading = true;
      getCustomer(this)
        .then(res => {
          this.shopCustomerList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.searchLoading = false;
        });
    },
    resetverifyCoupon() {
      // this.verify.order_no = ''
      this.verify.code = "";
      this.verify.order_total = "";
    },
    editHandle(data) {
      this.orderForm.code = data.code;
      this.dialogFormVisible = true;
    },
    modifyCoupon() {
      this.setting.loading = true;
      let args = {
        code: this.orderForm.code,
        order_no: this.orderForm.order_no
      };
      modifyCoupon(this, args)
        .then(res => {
          this.dialogFormVisible = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getCouponList();
        })
        .catch(err => {
          this.setting.loading = false;
          this.dialogFormVisible = false;
          this.$message({
            message: err.response.data.message,
            type: "error"
          });
        });
    },
    verifyCoupon() {
      this.setting.loading = true;
      let args = {
        // order_no: this.verify.order_no,
        code: this.verify.code,
        order_total: this.verify.order_total
      };
      if (this.verify.order_total === "") {
        delete args.order_total;
      }
      verifyCoupon(this, args)
        .then(res => {
          this.$message({
            message: "核销成功",
            type: "success"
          });
          this.getCouponList();
        })
        .catch(err => {
          this.setting.loading = false;
          this.$message({
            message: err.response.data.message,
            type: "error"
          });
        });
    },
    getCouponList() {
      this.setting.loading = true;
      let args = {
        include: "customer,point.market.area",
        page: this.pagination.currentPage,
        status: this.filters.status,
        coupon_batch_id: this.filters.coupon_batch_id,
        shop_customer_id: this.filters.shop_customer_id,
        point_id: this.filters.point_id,
        start_date: this.handleDateTransform(this.filters.dateTime[0]),
        end_date: utils.handleDateTransform(this.filters.dateTime[1])
      };
      !this.filters.dateTime[0] ? delete args.start_date : args.start_date;
      !this.filters.dateTime[1] ? delete args.end_date : args.end_date;
      if (this.filters.status === "") {
        delete args.status;
      }
      if (this.filters.shop_customer_id === "") {
        delete args.shop_customer_id;
      }
      if (this.filters.coupon_batch_id === "") {
        delete args.coupon_batch_id;
      }
      if (this.filters.point_id === "") {
        delete args.point_id;
      }
      getCouponList(this, args)
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
      this.getCouponList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getCouponList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getCouponList();
    },
    handleDateTransform: function(time) {
      var d = new Date(time);
      var year = d.getFullYear();
      var month = change(d.getMonth() + 1);
      var day = change(d.getDate());
      var hour = change(d.getHours());
      var minute = change(d.getMinutes());
      var second = change(d.getSeconds());
      function change(t) {
        if (t < 10) {
          return "0" + t;
        } else {
          return t;
        }
      }
      return (time =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second);
    }
  }
};
</script>

<style lang="less" scoped>
.root {
  font-size: 14px;
  color: #5e6d82;
  .item-input {
    width: 200px;
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
