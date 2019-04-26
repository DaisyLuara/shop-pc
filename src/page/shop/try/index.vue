<template>
  <div class="shop-try">
    <div class="shop-try_steps">
      <el-steps
        :active="active"
        finish-status="success"
        align-center
      >
        <el-step title="基础配置"></el-step>
        <el-step title="确认订单"></el-step>
      </el-steps>
    </div>
    <!-- 基础配置 -->
    <div
      class="shop-try_content"
      v-if="active===0"
    >
      <div class="shop-try_content-address">
        <h4 class="shop-try_content-address-title">位置</h4>
        <el-form
          :inline="true"
          :model="shopTryForm"
        >
          <el-form-item label="区域">
            <el-select
              v-model="shopTryForm.area_id"
              placeholder="请选择区域"
              size="small"
              @change="areaHandle($event)"
            >
              <el-option
                v-for="area in areaList"
                :label="area.name"
                :value="area.id"
                :key="area.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="场地">
            <el-select
              v-model="shopTryForm.market_id"
              placeholder="请选择场地"
              size="small"
              @change="marketHandle($event)"
            >
              <el-option
                v-for="market in marketList"
                :label="market.name"
                :value="market.id"
                :key="market.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="点位">
            <el-select
              v-model="shopTryForm.point_id"
              placeholder="请选择点位"
              size="small"
            >
              <el-option
                v-for="point in pointList"
                :label="point.name"
                :value="point.id"
                :key="point.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="shop-try_content-project">
        <h4 class="shop-try_content-project-title">节目</h4>
        <div class="shop-try_content-project-name-content">
          <div class="title-tabs">
            <div class="shop-try_project-title">节目名称：</div>
            <div class="shop-try_project-tabs">
              <span
                class="shop-try_project-name"
                v-for="item in projectList"
                :key="item.id"
                :class="[projectKey===item.id ? 'is-active':'']"
                @click="porectHandle(item.id)"
              >{{item.name}}</span>
            </div>
          </div>
          <div class="shop-try_content-skin">
            <el-table
              :data="tableData"
              style="width: 100%"
              :row-style="{height:'70px'}"
              :header-cell-style="headerStyle"
              @selection-change="handleSelectProject"
            >
              <el-table-column
                type="selection"
                width="45"
              />
              <el-table-column
                prop="name"
                label="皮肤名称"
                min-width="150"
              ></el-table-column>
              <el-table-column
                prop="icon"
                label="图标"
                width="150"
              >
                <template slot-scope="scope">
                  <img
                    :src="scope.row.icon"
                    style="width: 50%;"
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格(积分)"
                min-width="100"
              />
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 确认订单 -->
    <div
      class="shop-try_confirm"
      v-if="active===1"
    >
      <div class="shop-try_confirm-address">
        <h4 class="shop-try_confirm-address-title">所选位置</h4>
        <el-form
          :inline="true"
          :model="shopTryForm"
        >
          <el-form-item label="区域：">上海</el-form-item>
          <el-form-item label="场地：">上海湾</el-form-item>
          <el-form-item label="点位：">1F-扶梯口</el-form-item>
        </el-form>
      </div>
      <div class="shop-try_confirm-project">
        <h4 class="shop-try_confirm-project-title">所选配置</h4>
        <div class="shop-try_confirm-project-content">
          <h4 class="shop-try_confirm-project-content-title">基础配置</h4>
          <div class="shop-try_confirm-info-show">
            <div class="shop-try_confirm-info-show-item">节目: 超级英雄A</div>
            <div class="shop-try_confirm-info-show-item">皮肤: 超级英雄A皮肤1</div>
          </div>
        </div>
      </div>
    </div>

    <div class="operate-order">
      <div class="operate-order_item">合计:<span>100</span>积分</div>
      <div class="operate-orede_btn">
        <div
          class="operate-order_btn-prev"
          @click="prev"
          v-if="active!==0"
        >上一步</div>
        <div
          class="operate-order_btn-next"
          @click="next"
          v-if="active!==1"
        ></div>
        <div
          class="operate-order_btn-add-shop"
          v-if="active===1"
          @click="addToCart"
        ></div>
        <div
          class="operate-order_btn-confirm"
          v-if="active===1"
          @click="confirmShop"
        ></div>
      </div>
    </div>
    <!-- 付款 -->
    <el-dialog
      title="购买道具"
      :visible.sync="dialogShop"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="pay-dialog"
    >
      <el-form :model="payForm">
        <el-form-item
          label="支付方式:"
          label-width="80px"
        >
          <el-radio
            v-model="payForm.way"
            :label="1"
          >积分</el-radio>
        </el-form-item>
        <el-form-item
          label="支付金额:"
          label-width="80px"
        >
          <span style="color:#db1010;font-size:16px;font-weight: 600;margin-right:10px;">{{ payForm.money }}</span>
          <span style="color:#7e58cb;">积分</span>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogShop = false"
          size="small"
        >立即购买</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Steps,
  Step,
  Form,
  FormItem,
  Select,
  Option,
  TableColumn,
  Table,
  Radio,
  Dialog,
  Button,
  Checkbox
} from "element-ui";
import { getOpenAears, getOpenMarkets, getOpenPoints, addToCart } from "service";
export default {
  components: {
    "el-steps": Steps,
    "el-step": Step,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-select": Select,
    "el-option": Option,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-dialog": Dialog,
    "el-button": Button,
    "el-radio": Radio,
    "el-checkbox": Checkbox
  },
  data() {
    return {
      dialogShop: false,
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      payForm: {
        way: 1,
        money: 0
      },
      shopTryForm: {
        area_id: null,
        market_id: null,
        point_id: null
      },
      active: 0,
      finallyActive: 1,
      projectKey: 1,
      projectList: [
        {
          id: 1,
          name: "节目1"
        },
        {
          id: 2,
          name: "英雄"
        },
        {
          id: 3,
          name: "超级英雄22"
        },
        {
          id: 4,
          name: "超级英雄"
        },
        {
          id: 5,
          name: "超级111英雄"
        },
        {
          id: 6,
          name: "超级英ww雄"
        },
        {
          id: 7,
          name: "超级英ww雄"
        },
        {
          id: 8,
          name: "超级英雄"
        },
        {
          id: 9,
          name: "超级英ww雄"
        },
        {
          id: 10,
          name: "超级英ww雄"
        },
        {
          id: 11,
          name: "超级的福利大煞风景的实力的反垄断法英雄"
        }
      ],
      skinId: null,
      tableData: [
        {
          id: 1,
          name: "皮肤1",
          icon: "http://image.xingstation.cn/1007/image/1547450898.jpg",
          price: 10
        },
        {
          id: 2,
          name: "皮肤2",
          icon: "http://image.xingstation.cn/1007/image/1547450898.jpg",
          price: 100
        },
        {
          id: 3,
          name: "皮肤3",
          icon: "http://image.xingstation.cn/1007/image/1547450898.jpg",
          price: 20
        },
        {
          id: 4,
          name: "皮肤4",
          icon: "http://image.xingstation.cn/1007/image/1547450898.jpg",
          price: 30
        }
      ],
      marketList: [],
      pointList: [],
      areaList: []
    };
  },
  created() {
    this.getOpenAears();
    let product = localStorage.getItem("product");
    if (product) {
      this.shopTryForm.area_id = JSON.parse(product).area_id;
      this.shopTryForm.market_id = JSON.parse(product).market_id;
      this.shopTryForm.point_id = JSON.parse(product).point_id;
      this.showAddress();
    } else {
      this.$router.push({
        path: "/guide/product"
      });
    }
  },
  methods: {
    showAddress() {
      this.areaHandle(this.shopTryForm.area_id);
      this.marketHandle(this.shopTryForm.market_id);
    },
    marketHandle(val, index) {
      this.getOpenPoints(val, index);
    },
    areaHandle(val, index) {
      this.getOpenMarkets(val, index);
    },
    getOpenMarkets(areaid, index) {
      let args = {
        areaid: areaid
      };
      getOpenMarkets(this, args)
        .then(res => {
          this.marketList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getOpenAears() {
      getOpenAears(this)
        .then(res => {
          this.areaList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getOpenPoints(marketid, index) {
      let args = {
        marketid: marketid
      };
      getOpenPoints(this, args)
        .then(res => {
          this.pointList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirmShop() {
      this.dialogShop = true;
    },
    prev() {
      if (this.active === 0) {
        return;
      }
      this.active--;
    },
    next() {
      if (this.active === 1) {
        return;
      }
      this.active++;
    },
    porectHandle(val) {
      this.projectKey = val;
    },
    handleSelectProject(val) {
      console.log(val)
    },
    addToCart(data) {
      console.log(data)
      let args = {
        sku_id: '4,5,7,12'
      }
      addToCart(this, args).then(res => {
        this.$message({
          message: '加入成功',
          type: 'success'
        })
        this.$router.push({
          path: '/account/cart'
        })
      }).catch(err => {
        this.$message({
          message: '加入失败',
          type: 'error'
        });
      })
    },
  }
};
</script>
<style lang="less" scoped>
@img: "https://cdn.xingstation.cn/ad_guide/";
.shop-try {
  .shop-try_steps {
    margin-bottom: 20px;
  }
  .shop-try_content,
  .shop-try_confirm {
    .shop-try_content-address,
    .shop-try_confirm-address {
      display: flex;
      background: #fff;
      flex-direction: row;
      padding: 15px 20px;
      margin-bottom: 30px;
      .shop-try_content-address-title,
      .shop-try_confirm-address-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 10%;
        color: #333;
        font-size: 18px;
        font-weight: 600;
      }
      .el-form {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
      }
      .el-form-item {
        flex: 1;
        text-align: center;
        margin-bottom: 0;
        color: #666;
        font-size: 18px;
      }
    }
    .shop-try_content-project,
    .shop-try_confirm-project {
      display: flex;
      margin-bottom: 30px;
      flex-direction: row;
      padding: 15px 20px;
      background: #fff;
      .shop-try_content-project-title,
      .shop-try_confirm-project-title {
        display: flex;
        flex-direction: column;
        justify-content: baseline;
        align-items: flex-start;
        width: 10%;
        color: #333;
        font-weight: 600;
        font-size: 18px;
      }
      .shop-try_content-project-name-content {
        width: 90%;
        .title-tabs {
          display: flex;
          flex-direction: row;
          margin-bottom: 30px;
          width: 100%;
          .shop-try_project-title {
            padding: 5px 0;
            margin-right: 10px;
            font-size: 14px;
            width: 100px;
          }
          .shop-try_project-tabs {
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .shop-try_project-name {
              padding: 5px 10px;
              margin-right: 10px;
              color: #444;
              font-size: 14px;
              margin-bottom: 10px;
              border: 1px solid #ccc;
              border-radius: 5px;
              &:hover {
                background: #7e58cb;
                border: 1px solid #7e58cb;
                color: #fff;
                opacity: 0.8;
              }
            }
            .is-active {
              background: #7e58cb;
              border: 1px solid #7e58cb;
              color: #fff;
            }
          }
        }
        .shop-try_content-skin {
        }
      }
    }
  }
  .shop-try_confirm {
    .shop-try_confirm-project {
      .shop-try_confirm-project-content {
        width: 90%;
        .shop-try_confirm-project-content-title {
          margin-bottom: 20px;
          font-weight: 600;
          font-size: 18px;
          color: #333;
        }
        .shop-try_confirm-info-show {
          display: flex;
          flex-direction: row;
          .shop-try_confirm-info-show-item {
            width: 50%;
            font-weight: 600;
            font-size: 16px;
            color: #333;
          }
        }
      }
    }
  }

  .operate-order {
    justify-content: flex-end;
    align-items: center;
    display: flex;
    flex-direction: row;
    // background: #fff;
    padding: 15px 0;
    .operate-order_item {
      color: #333;
      font-size: 18px;
      font-weight: 700;
      margin-right: 150px;
      span {
        color: #f25357;
        margin-right: 10px;
        margin-left: 5px;
        font-size: 26px;
      }
    }
    .operate-orede_btn {
      display: flex;
      flex-direction: row;
      .operate-order_btn-prev,
      .operate-order_btn-next,
      .operate-order_btn-add-shop {
        // color: #7e58cb;
        margin-right: 10px;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 700;
        // border: 1px solid #7e58cb;
        width: 150px;
        height: 40px;
        font-size: 16px;
      }
      .operate-order_btn-next {
        background-image: url("@{img}confirm_order.png");
        background-size: 100% auto;
        background-position: center;
        background-repeat: no-repeat;
      }
      .operate-order_btn-add-shop {
        width: 150px;
        height: 40px;
        background-image: url("@{img}btn_goto_cart.png");
        background-size: 100% auto;
        background-position: center;
        background-repeat: no-repeat;
      }
      .operate-order_btn-confirm {
        width: 150px;
        height: 40px;
        // color: #fff;
        margin-right: 10px;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 700;
        // border: 1px solid #7e58cb;
        font-size: 16px;
        // background: #7e58cb;
        background-image: url("@{img}confirm_order.png");
        background-size: 100% auto;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
<style lang="less">
@img: "https://cdn.xingstation.cn/ad_guide/";
.shop-try_content-project-name-content {
  .cell {
    // text-align: center;
    .el-checkbox__inner {
      border-radius: 50%;
    }
  }
}
.pay-dialog {
  .el-dialog {
    width: 40%;
  }
  .el-dialog__header {
    background: #7e58cb;
    padding: 10px 20px;
    position: relative;
    .el-dialog__title {
      color: #fff !important;
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 50%;
      transform: translateY(-50%);
    }
    .el-icon-close {
      color: #fff;
      border: solid 1px #fff;
      border-radius: 50%;
      padding: 2px;
    }
  }
  .dialog-footer {
    text-align: center;
    margin-top: -50px;
    margin-bottom: 50px;
    .el-button {
      background-image: url("@{img}solution_btn_bg.png");
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      border: none;
      background-color: transparent;
      padding: 10px 40px;
    }
  }
}
</style>
