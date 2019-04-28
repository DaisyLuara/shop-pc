<template>
  <div 
    v-loading="setting.loading" 
    :element-loading-text="setting.loadingText" 
    class="root">
    <h3 class="title">我的购物车</h3>
    <div class="cart-list">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="cart-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column 
          label="全选" 
          type="selection" 
          width="55"/>
        <el-table-column 
          label="配置信息" 
          min-width="150">
          <template slot-scope="scope">
            <div class="s12 c9">{{ scope.row.productSku.title }}</div>
          </template>
        </el-table-column>
        <el-table-column 
          label="类型" 
          min-width="100">
          <template slot-scope="scope">
            <div
              class="s12 c9"
            >{{ scope.row.productSku.type === 'point' ? '点位' : scope.row.productSku.type === 'skin' ? '皮肤' :'节目' }}</div>
          </template>
        </el-table-column>
        <el-table-column 
          label="单价(积分)" 
          min-width="100">
          <template slot-scope="scope">
            <span class="s16 c3">{{ scope.row.productSku.credit_price }}</span>
          </template>
        </el-table-column>
        <el-table-column 
          label="数量" 
          min-width="80">
          <template slot-scope="scope">
            <span class="s12 c9">{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          min-width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              class="product-delete s12"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="biling-bar">
      <ul class="ul-total">
        <li>
          已选商品
          <span>{{ totalNumber }}</span>件
        </li>
        <li>
          合计
          <span>{{ totalPrices }}</span>积分
        </li>
      </ul>
      <el-button
        :disabled="totalNumber>0 ? false: true"
        size="mini"
        type="warning"
        class="pay"
        @click="submit"
      >确认购买</el-button>
    </div>
    <!-- 付款 -->
    <el-dialog
      :visible.sync="dialogShop"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="购买道具"
      class="pay-dialog"
    >
      <el-form :model="payForm">
        <el-form-item 
          label="支付方式:" 
          label-width="80px">
          <el-radio 
            v-model="payForm.way" 
            :label="1">积分</el-radio>
        </el-form-item>
        <el-form-item 
          label="支付金额:" 
          label-width="80px">
          <span
            style="color:#db1010;font-size:16px;font-weight: 600;margin-right:10px;"
          >{{ payForm.money }}</span>
          <span style="color:#7e58cb;">积分</span>
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button 
          type="primary" 
          size="small" 
          @click="buyNow">立即购买</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  Table,
  TableColumn,
  Button,
  Message,
  Dialog,
  FormItem,
  Radio,
  Form
} from "element-ui";
import {
  getShoppingCartList,
  deleteCartProduct,
  getCartTotals,
  submitOrder,
  paymentCredit
} from "service";
export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-dialog": Dialog,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-radio": Radio
  },
  data() {
    return {
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      dialogShop: false,
      payForm: {
        way: 1,
        money: 0
      },
      tableData: [],
      multipleSelection: [],
      totalPrices: 0,
      itemsArgs: [],
      orderId: null
    };
  },
  computed: {
    totalNumber() {
      return this.multipleSelection.length;
    }
  },
  created() {},
  mounted() {
    this.getCartList();
  },
  methods: {
    buyNow() {
      paymentCredit(this, this.orderId)
        .then(res => {
          this.dialogShop = false;
          this.$router.push({
            path:'/account/order'
          })
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: "error"
          });
        });
    },
    getOrderArgs() {
      let items = [];
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.map(r => {
          items.push({
            sku_id: r.product_sku_id,
            amount: 1
          });
        });
      }
      this.itemsArgs = items;
      return this.itemsArgs;
    },
    getCartTotals() {
      this.getOrderArgs();
      let args = {
        items: this.itemsArgs
      };
      getCartTotals(this, args)
        .then(res => {
          let { total_credit_amount } = res;
          this.totalPrices = total_credit_amount;
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: "error"
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.totalPrices = val.length;
      if (val.length !== 0) {
        this.getCartTotals();
      }
    },
    handleDelete(data) {
      let id = data.product_sku_id;
      this.deleteProduct(id);
    },
    getCartList() {
      this.setting.loading = true;
      let args = {
        include: "productSku.product"
      };
      getShoppingCartList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
          this.$message({
            message: err.response.data.message,
            type: "error"
          });
        });
    },
    deleteProduct(id) {
      this.$confirm("确认要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCartProduct(this, id)
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getCartList();
            })
            .catch(err => {
              this.$message({
                message: "删除失败",
                type: "error"
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
    submit() {
      let args = {
        items: this.getOrderArgs()
      };
      submitOrder(this, args)
        .then(res => {
          this.payForm.money = res.total_credit_amount;
          this.getCartList();
          this.orderId = res.id;
          this.dialogShop = true;
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: "error"
          });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.s12 {
  font-size: 12px;
}
.s16 {
  font-size: 16px;
}
.s18 {
  font-size: 16px;
}
.c3 {
  color: #333;
}
.c9 {
  color: #999;
}
.root {
  width: 100%;
  height: 100%;
  // min-height: 860px;
  position: relative;
  margin-top: 0;
  margin-left: 0;
  .title {
    padding: 40px 40px 0 40px;
    background-color: #fff;
    font-size: 18px;
    font-weight: 600;
    color: #7e58cb;
  }
  .cart-list {
    padding: 40px 40px 40px 40px;
    background-color: #fff;
    .cart-table {
      .cell {
        text-align: center !important;
      }
    }
    .product-delete {
      width: 120px;
      height: 30px;
      text-align: center;
      color: red;
      background: transparent;
      border: solid 1px red;
      font-weight: 600;
      border-radius: 15px;
    }
  }
  .biling-bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: right;
    align-items: center;
    overflow: hidden;
    margin-top: 30px;
    background-color: #eff2f7;
    .ul-total {
      display: inline-block;
      margin-right: 60px;
      height: 100%;
      li {
        display: inline-block;
        margin-right: 60px;
        font-size: 20px;
        font-weight: bold;
        color: #7e58cb;
        span {
          font-size: 26px;
          color: #f25375;
          padding-left: 10px;
          font-weight: bold;
          padding-right: 5px;
        }
      }
    }
    .pay {
      font-size: 16px;
      color: #fff;
      letter-spacing: 1px;
      padding: 10px 50px;
      border: none;
      border-radius: 20px;
      background: linear-gradient(to right, #007ccd, #00d1cf, #00f5d1);
    }
  }
}
</style>
<style lang="less">
// .cart-list {
//   .cart-table {
//     .cell {
//       text-align: center;
//       .el-checkbox__inner {
//         border-radius: 50%;
//       }
//     }
//   }
// }
</style>
