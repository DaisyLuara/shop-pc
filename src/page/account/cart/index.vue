<template>
  <div class="root">
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
          width="55"
        >
        </el-table-column>
        <el-table-column
          label="配置信息"
          width="320"
        >
          <template slot-scope="scope">
            <div class="s12 c9">{{scope.row.productSku.title}}</div>
            <div class="s12 c9">{{scope.row.productSku.product.description}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="单价积分"
          width="220"
        >
          <template slot-scope="scope">
            <span class="s16 c3"> {{scope.row.productSku.product.price}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="220"
        >
          <template slot-scope="scope">
            <span class="s12 c9">{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
        <li>已选商品<span>{{totalNumber}}</span>件</li>
        <li>合计<span>{{totalPrices}}</span>积分</li>
      </ul>
      <el-button
        v-if="totalPrices>0"
        size="mini"
        type="warning"
        class="pay"
        @click="submit"
      >确认支付</el-button>
      <el-button
        v-else
        size="mini"
        type="warning"
        class="pay"
        disabled
        @click="submit"
      >确认支付</el-button>
    </div>
  </div>
</template>
<script>
import {
  Table,
  TableColumn,
  Button,
  Message
} from "element-ui";
import {
  getShoppingCartList,
  deleteCartProduct
} from "service";
export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      totalPrices: 0,
    };
  },
  computed: {
    totalNumber() {
      return this.multipleSelection.length
    }
  },
  created() {

  },
  mounted() {
    this.getCartList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.totalPrices = 0
      val.forEach(item => {
        this.totalPrices += item.price
      })
    },
    handleDelete(data) {
      let id = data.product_sku_id
      this.deleteProduct(id)
    },
    getCartList() {
      let args = {
        include: 'productSku.product'
      }
      getShoppingCartList(this, args).then(res => {
        this.tableData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    deleteProduct(id) {
      deleteCartProduct(this, id).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.getCartList()
      }).catch(err => {
        this.$message({
          message: '删除失败',
          type: 'error'
        });
      })
    },
    submit() {

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
  min-height: 860px;
  position: relative;
  margin-top: -40px;
  margin-left: -20px;
  background-color: #fff;
  padding: 40px 40px 60px 40px;
  .title {
    font-size: 28px;
    font-weight: 600;
    color: #7e58cb;
  }
  .cart-list {
    margin-top: 40px;
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
    position: fixed;
    bottom: 0%;
    left: 0%;
    height: 60px;
    text-align: right;
    overflow: hidden;
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
          font-size: 36px;
          color: red;
          padding-left: 10px;
          font-weight: bold;
          padding-right: 5px;
        }
      }
    }
    .pay {
      font-size: 28px;
      letter-spacing: 1px;
      padding: 10px 30px;
      height: 100%;
    }
  }
}
</style>
<style lang="less">
.cart-list {
  margin-top: 40px;
  .cart-table {
    .cell {
      text-align: center;
      .el-checkbox__inner {
        border-radius: 50%;
      }
    }
  }
}
</style>
