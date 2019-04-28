<template>
  <div class="product-wrap">
    <div class="product-warp_head">
      <div class="product-warp_head-title">
        <h3 class="product-warp_head-title-item">全套解决方案</h3>
        <div class="product-warp_head-title-item-info">提供一站式“互联网+”转型服务，为客户提供全方位的解决方案</div>
      </div>
      <img :src="img_url+'ad_guide/indextit.jpg'">
    </div>
    <div class="product-wrap_content">
      <div class="product-wrap_content-tabs">
        <div
          v-for="item in menu"
          :class="[tabKey === item.id ? 'is-active':'']"
          :key="item.id"
          class="product-wrap_content-tabs-item"
          @click="tabHandle(item.id)"
        >{{ item.name }}</div>
      </div>
      <div class="product-wrap_content-detail">
        <div
          v-for="(item,index) in productData"
          :key="item.id"
          class="product-wrap_content-detail-item"
        >
          <div class="product-wrap_project-name-img">
            <div class="product-wrap_project-img">
              <img :src="item.project ? item.project.image:''">
            </div>
            <h3 class="product-wrap_project-name">{{ item.project?item.project.title:'' }}</h3>
          </div>
          <div class="product-wrap_project-info">
            <div class="product-wrap_desc">
              <h4>扩展皮肤: {{ item.skin?item.skin.title:'' }}</h4>
            </div>
            <div class="product-wrap_desc">
              <h4>运行设备: {{ item.project?item.project.device:'' }}</h4>
            </div>
            <div class="product-wrap_desc">
              <h4>互动技术: {{ item.project?item.project.interactive_tech:'' }}</h4>
            </div>
            <div class="product-wrap_desc">
              <h4>玩法类型: {{ item.project?item.project.play:'' }}</h4>
            </div>
          </div>
          <div class="product-wrap-project-address">
            <el-form 
              :model="addressFormArr[index].addressForm" 
              :ref="'addressForm_'+index">
              <el-form-item
                :rules="[{ required: true, message: '区域不能为空'}]"
                label="区域"
                prop="area_id"
                label-width="100px"
              >
                <el-select
                  v-model="addressFormArr[index].addressForm.area_id"
                  placeholder="请选择区域"
                  size="small"
                  @change="areaHandle($event,index)"
                >
                  <el-option
                    v-for="area in areaList"
                    :label="area.name"
                    :value="area.id"
                    :key="area.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :rules="[{ required: true, message: '场地不能为空'}]"
                label="场地"
                prop="market_id"
                label-width="100px"
              >
                <el-select
                  v-model="addressFormArr[index].addressForm.market_id"
                  placeholder="请选择场地"
                  size="small"
                  @change="marketHandle($event,index)"
                >
                  <el-option
                    v-for="market in marketObject[index]"
                    :label="market.name"
                    :value="market.id"
                    :key="market.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :rules="[{ required: true, message: '点位不能为空'}]"
                label="点位"
                prop="point_id"
                label-width="100px"
              >
                <el-select
                  v-model="addressFormArr[index].addressForm.point_id"
                  placeholder="请选择点位"
                  size="small"
                >
                  <el-option
                    v-for="point in pointObject[index]"
                    :label="point.name"
                    :value="point.id"
                    :key="point.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label-width="100px">
                <el-button
                  type="primary"
                  size="small"
                  style="border: none;width:250px;
                  border-radius: 20px;
                  background: linear-gradient(to right, #007ccd, #00d1cf, #00f5d1);"
                  @click="submit(index,item.package_id)"
                >立即试用</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const CDN = process.env.IMG_URL;
import { Form, Option, FormItem, Select, Button, Message } from "element-ui";
import auth from "service/auth";
import {
  getProductPackages,
  getProductGroups,
  getOpenAears,
  getOpenMarkets,
  getOpenPoints
} from "service";

export default {
  components: {
    "el-form": Form,
    "el-form-item": FormItem,
    "el-option": Option,
    "el-select": Select,
    "el-button": Button
  },
  data() {
    return {
      addressFormArr: [],
      img_url: CDN,
      tabKey: 1,
      menu: [],
      areaList: [],
      marketObject: [],
      pointObject: [],
      productData: []
    };
  },
  created() {
    this.getProductPackages();
    this.getOpenAears();
  },
  methods: {
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
          this.marketObject.splice(index, 1, res.data);
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
          this.pointObject.splice(index, 1, res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getProductGroups() {
      let args = {
        package_id: this.tabKey,
        include: "skus"
      };
      getProductGroups(this, args)
        .then(res => {
          let { data } = res;
          let length = data.length;
          this.productData = data;
          data.map((r, index) => {
            this.marketObject.push([]);
            this.pointObject.push([]);
            this.addressFormArr.push({
              addressForm: {
                area_id: null,
                market_id: null,
                point_id: null
              }
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getProductPackages() {
      getProductPackages(this)
        .then(res => {
          this.menu = res.data;
          this.tabKey = this.menu[0].id;
          this.getProductGroups();
        })
        .catch(err => {});
    },
    tabHandle(val) {
      this.tabKey = val;
      this.getProductGroups();
    },
    submit(index, package_id) {
      let { point_id, area_id, market_id } = this.addressFormArr[
        index
      ].addressForm;
      if (!point_id || !market_id || !area_id) {
        this.$message({
          message: "地址信息请填写完整",
          type: "warning"
        });
        return;
      } else {
        let product = {
          package_id: package_id,
          point_id: point_id,
          market_id: market_id,
          area_id: area_id
        };
        localStorage.setItem("product", JSON.stringify(product));
      }
      if (auth.checkLogin()) {
        this.$router.push({
          path: "/shop/try"
        });
      } else {
        this.$router.push({
          path: "/login",
          query: {
            type: "product"
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@img: "https://cdn.xingstation.cn/ad_guide/";
.product-wrap {
  .product-warp_head {
    img {
      width: 100%;
    }
    position: relative;
    .product-warp_head-title {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .product-warp_head-title-item {
        color: #fff;
        font-size: 32px;
        font-weight: 600;
        text-align: center;
      }
      .product-warp_head-title-item-info {
        color: #fff;
        font-size: 18px;
        text-align: center;
        margin-top: 10px;
      }
    }
  }
  .product-wrap_content {
    background: #fff;
    .product-wrap_content-tabs {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 60px;
      .product-wrap_content-tabs-item {
        padding: 15px 30px;
        margin-right: 50px;
        cursor: pointer;
        color: #7e58cc;
        font-weight: 500;
        font-size: 18px;
        background-image: url("@{img}solution_btn_border.png");
        background-size: 100% auto;
        background-position: center;
        background-repeat: no-repeat;
        &:hover {
          opacity: 0.8;
          color: #fff;
          background-image: url("@{img}solution_btn_bg.png");
        }
      }
      .is-active {
        background-image: url("@{img}solution_btn_bg.png");
        color: #fff;
      }
    }
    .product-wrap_content-detail {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      .product-wrap_content-detail-item {
        margin-bottom: 20px;
        padding: 30px;
        display: flex;
        flex-direction: row;
        background: #f9f9f9;
        .product-wrap_project-name-img {
          padding: 20px;
          width: 40%;
          .product-wrap_project-name {
            margin-top: 15px;
            color: #444;
            font-size: 26px;
            font-weight: 700;
          }
          .product-wrap_project-img {
            img {
              width: 30%;
            }
          }
        }
        .product-wrap_project-info {
          padding: 20px;
          width: 50%;
          color: #444;
          .product-wrap_desc {
            margin-bottom: 40px;
          }
          h4 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
          }
          p {
            font-size: 14px;
            line-height: 1.5;
          }
        }
        .product-wrap-project-address {
          padding: 20px;
          width: 40%;
          font-size: 18px;
          .el-select {
            width: 250px;
          }
          .el-form-item__label {
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
@img: "https://cdn.xingstation.cn/ad_guide/";
.product-wrap-project-address {
  .el-form-item__label {
    color: #333;
    font-weight: 600;
    font-size: 18px;
    text-align: left;
  }
}
</style>
