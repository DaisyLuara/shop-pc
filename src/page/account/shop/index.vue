<template>
  <div class="shop-try">
    <div class="shop-try_steps">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="基础配置"></el-step>
        <el-step title="确认订单"></el-step>
      </el-steps>
    </div>
    <!-- 基础配置 -->
    <div class="shop-try_content" v-if="active===0">
      <div class="shop-try_content-address">
        <h4 class="shop-try_content-address-title">位置</h4>
        <el-form :inline="true" :model="shopTryForm">
          <el-form-item label="区域">
            <el-select v-model="shopTryForm.area_id" placeholder="请选择区域">
              <el-option label="区域一" value="1"></el-option>
              <el-option label="区域二" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="场地">
            <el-select v-model="shopTryForm.market_id" placeholder="请选择场地">
              <el-option label="区域一" value="1"></el-option>
              <el-option label="区域二" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="点位">
            <el-select v-model="shopTryForm.point_id" placeholder="请选择点位">
              <el-option label="区域一" value="1"></el-option>
              <el-option label="区域二" value="2"></el-option>
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
            >
              <el-table-column prop="id" label="ID" min-width="100">
                <template slot-scope="scope">
                  <el-radio v-model="skinId" :label="scope.row.id"/>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="皮肤名称" min-width="150"></el-table-column>
              <el-table-column prop="icon" label="图标" width="150">
                <template slot-scope="scope">
                  <img :src="scope.row.icon" style="width: 50%;">
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格(积分)" min-width="100"/>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 确认订单 -->
    <div class="shop-try_confirm" v-if="active===1">
      <div class="shop-try_confirm-address">
        <h4 class="shop-try_confirm-address-title">所选位置</h4>
        <el-form :inline="true" :model="shopTryForm">
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
      <div class="operate-order_item">合计:100</div>
      <div class="operate-orede_btn">
        <div class="operate-order_btn-prev" @click="prev" v-if="active!==0">上一步</div>
        <div class="operate-order_btn-next" @click="next" v-if="active!==1">确认订单</div>
        <div class="operate-order_btn-add-shop" v-if="active===1">加入购物车</div>
        <div class="operate-order_btn-confirm" v-if="active===1">确认购买</div>
      </div>
    </div>
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
  Radio
} from "element-ui";
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
    "el-radio": Radio
  },
  data() {
    return {
      headerStyle: { background: "#6b3ec2", color: "#fff" },
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
      ]
    };
  },
  methods: {
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
    }
  }
};
</script>
<style lang="less" scoped>
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
      }
      .el-form-item {
        margin-bottom: 0;
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
        justify-content: center;
        align-items: flex-start;
        width: 10%;
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
          margin-bottom: 15px;
          font-weight: 700;
          font-size: 16px;
        }
        .shop-try_confirm-info-show {
          display: flex;
          flex-direction: row;
          .shop-try_confirm-info-show-item{
            width: 50%;
          }
        }
      }
    }
  }

  .operate-order {
    justify-content: space-around;
    align-items: center;
    background: #000;
    display: flex;
    flex-direction: row;
    background: #fff;
    padding: 15px 0;
    .operate-order_item {
      color: #7e58cb;
      font-size: 18px;
      font-weight: 700;
    }
    .operate-orede_btn {
      display: flex;
      flex-direction: row;
      .operate-order_btn-prev,
      .operate-order_btn-next,
      .operate-order_btn-add-shop {
        color: #7e58cb;
        margin-right: 10px;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 700;
        border: 1px solid #7e58cb;
        font-size: 16px;
      }
      .operate-order_btn-confirm {
        color: #fff;
        margin-right: 10px;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 700;
        border: 1px solid #7e58cb;
        font-size: 16px;
        background: #7e58cb;
      }
    }
  }
}
</style>
