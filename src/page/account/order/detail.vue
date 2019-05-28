<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="item-list-wrap"
    >
      <div class="item-content-wrap">
        <div class="actions-wrap">
          <span class="label">
            <span 
              style="cursor:pointer;" 
              @click="toMyOrder">我的订单</span>
            > 订单详情
          </span>
        </div>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          :row-style="{height:'70px'}"
          :header-cell-style="headerStyle"
          style="width: 100%"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="title"
            label="商品名称"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.productSku.title }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="type"
            label="商品信息"
            min-width="80"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.productSku.type === 'point' ? '点位' : scope.row.productSku.type === 'skin' ? '皮肤' :'节目' }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="credit_price"
            label="单价（积分）"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.productSku.credit_price }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="amount"
            label="数量"
            min-width="90"
          >
            <template slot-scope="scope">{{ scope.row.amount }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderDetailList } from "service";

import { Button, Table, TableColumn, MessageBox } from "element-ui";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
  },
  data() {
    return {
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      orderId: null,
      tableData: []
    };
  },
  created() {
    this.orderId = this.$route.params.uid;
    this.getOrderDetailList();
  },
  methods: {
    toMyOrder() {
      this.$router.push({
        path: "/account/order"
      });
    },
    getOrderDetailList() {
      this.setting.loading = true;
      let args = {
        include: "items.productSku",
      };
      getOrderDetailList(this, this.orderId, args)
        .then(res => {
          this.tableData = res.items.data;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
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
    background: #fff;
    padding: 30px;

    .item-content-wrap {
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
      .point-btn {
        background: #05c99a;
        color: #fff;
        border-color: #05c99a;
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
