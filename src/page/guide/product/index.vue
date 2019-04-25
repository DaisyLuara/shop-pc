<template>
  <div class="product-wrap">
    <div class="product-warp_head">
      <div class="product-warp_head-title">
        <h3 class="product-warp_head-title-item">全套解决方案</h3>
        <div class="product-warp_head-title-item-info">xxxxxxxxx</div>
      </div>
      <img :src="img_url+'ad_guide/indextit.jpg'">
    </div>
    <div class="product-wrap_content">
      <div class="product-wrap_content-tabs">
        <div
          class="product-wrap_content-tabs-item"
          v-for="item in menu"
          :class="[tabKey === item.id ? 'is-active':'']"
          :key="item.id"
          @click="tabHandle(item.id)"
        >{{ item.name }}</div>
      </div>
      <div class="product-wrap_content-detail">
        <div class="product-wrap_content-detail-item">
          <div class="product-wrap_project-name-img">
            <h3 class="product-wrap_project-name">超级英雄</h3>
            <div class="product-wrap_project-img">
              <img src="http://image.xingstation.cn/1007/image/1547450898.jpg">
            </div>
          </div>
          <div class="product-wrap_project-info">
            <div class="product-wrap_project-desc">
              <h4>节目：超级英雄</h4>
              <p>超级英雄节目超级英雄节目超级英雄节目超级英雄节目,超级英雄节目超级英雄节目超级英雄节目超级英雄节,目超级英雄节目超级英雄节目超级英雄节目超级英雄</p>
            </div>
            <div class="product-wrap_skin-desc">
              <h4>皮肤：暖阳色</h4>
              <p>皮肤：暖阳色,皮肤：暖阳色,皮肤：暖阳色</p>
            </div>
          </div>
          <div class="product-wrap-project-address">
            <el-form :model="addressForm" ref="addressForm" label-width="50px">
              <el-form-item
                label="区域"
                prop="area_id"
                :rules="[{ required: true, message: '区域不能为空'}]"
              >
                <el-select v-model="addressForm.area_id" placeholder="请选择区域" size="small">
                  <el-option label="区域一" value="1"></el-option>
                  <el-option label="区域二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="场地"
                prop="market_id"
                :rules="[{ required: true, message: '场地不能为空'}]"
              >
                <el-select v-model="addressForm.market_id" placeholder="请选择场地" size="small">
                  <el-option label="场地一" value="1"></el-option>
                  <el-option label="场地二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="点位"
                prop="point_id"
                :rules="[{ required: true, message: '点位不能为空'}]"
              >
                <el-select v-model="addressForm.point_id" placeholder="请选择点位" size="small">
                  <el-option label="点位一" value="1"></el-option>
                  <el-option label="点位二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" style="width:73%">立即试用</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="product-wrap_content-detail-item">
          <div class="product-wrap_project-name-img">
            <h3 class="product-wrap_project-name">超级英雄</h3>
            <div class="product-wrap_project-img">
              <img src="http://image.xingstation.cn/1007/image/1547450898.jpg">
            </div>
          </div>
          <div class="product-wrap_project-info">
            <div class="product-wrap_project-desc">
              <h4>节目：超级英雄</h4>
              <p>超级英雄节目超级英雄节目超级英雄节目超级英雄节目,超级英雄节目超级英雄节目超级英雄节目超级英雄节,目超级英雄节目超级英雄节目超级英雄节目超级英雄</p>
            </div>
            <div class="product-wrap_skin-desc">
              <h4>皮肤：暖阳色</h4>
              <p>皮肤：暖阳色,皮肤：暖阳色,皮肤：暖阳色</p>
            </div>
          </div>
          <div class="product-wrap-project-address">
            <el-form :model="addressForm" ref="addressForm" label-width="50px">
              <el-form-item
                label="区域"
                prop="area_id"
                :rules="[{ required: true, message: '区域不能为空'}]"
              >
                <el-select v-model="addressForm.area_id" placeholder="请选择区域" size="small">
                  <el-option label="区域一" value="1"></el-option>
                  <el-option label="区域二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="场地"
                prop="market_id"
                :rules="[{ required: true, message: '场地不能为空'}]"
              >
                <el-select v-model="addressForm.market_id" placeholder="请选择场地" size="small">
                  <el-option label="场地一" value="1"></el-option>
                  <el-option label="场地二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="点位"
                prop="point_id"
                :rules="[{ required: true, message: '点位不能为空'}]"
              >
                <el-select v-model="addressForm.point_id" placeholder="请选择点位" size="small">
                  <el-option label="点位一" value="1"></el-option>
                  <el-option label="点位二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" style="width:73%">立即试用</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="product-wrap_content-detail-item">
          <div class="product-wrap_project-name-img">
            <h3 class="product-wrap_project-name">超级英雄</h3>
            <div class="product-wrap_project-img">
              <img src="http://image.xingstation.cn/1007/image/1547450898.jpg">
            </div>
          </div>
          <div class="product-wrap_project-info">
            <div class="product-wrap_project-desc">
              <h4>节目：超级英雄</h4>
              <p>超级英雄节目超级英雄节目超级英雄节目超级英雄节目,超级英雄节目超级英雄节目超级英雄节目超级英雄节,目超级英雄节目超级英雄节目超级英雄节目超级英雄</p>
            </div>
            <div class="product-wrap_skin-desc">
              <h4>皮肤：暖阳色</h4>
              <p>皮肤：暖阳色,皮肤：暖阳色,皮肤：暖阳色</p>
            </div>
          </div>
          <div class="product-wrap-project-address">
            <el-form :model="addressForm" ref="addressForm" label-width="50px">
              <el-form-item
                label="区域"
                prop="area_id"
                :rules="[{ required: true, message: '区域不能为空'}]"
              >
                <el-select v-model="addressForm.area_id" placeholder="请选择区域" size="small">
                  <el-option label="区域一" value="1"></el-option>
                  <el-option label="区域二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="场地"
                prop="market_id"
                :rules="[{ required: true, message: '场地不能为空'}]"
              >
                <el-select v-model="addressForm.market_id" placeholder="请选择场地" size="small">
                  <el-option label="场地一" value="1"></el-option>
                  <el-option label="场地二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="点位"
                prop="point_id"
                :rules="[{ required: true, message: '点位不能为空'}]"
              >
                <el-select v-model="addressForm.point_id" placeholder="请选择点位" size="small">
                  <el-option label="点位一" value="1"></el-option>
                  <el-option label="点位二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" style="width:73%">立即试用</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="product-wrap_content-detail-item">
          <div class="product-wrap_project-name-img">
            <h3 class="product-wrap_project-name">超级英雄</h3>
            <div class="product-wrap_project-img">
              <img src="http://image.xingstation.cn/1007/image/1547450898.jpg">
            </div>
          </div>
          <div class="product-wrap_project-info">
            <div class="product-wrap_project-desc">
              <h4>节目：超级英雄</h4>
              <p>超级英雄节目超级英雄节目超级英雄节目超级英雄节目,超级英雄节目超级英雄节目超级英雄节目超级英雄节,目超级英雄节目超级英雄节目超级英雄节目超级英雄</p>
            </div>
            <div class="product-wrap_skin-desc">
              <h4>皮肤：暖阳色</h4>
              <p>皮肤：暖阳色,皮肤：暖阳色,皮肤：暖阳色</p>
            </div>
          </div>
          <div class="product-wrap-project-address">
            <el-form :model="addressForm" ref="addressForm" label-width="50px">
              <el-form-item
                label="区域"
                prop="area_id"
                :rules="[{ required: true, message: '区域不能为空'}]"
              >
                <el-select v-model="addressForm.area_id" placeholder="请选择区域" size="small">
                  <el-option label="区域一" value="1"></el-option>
                  <el-option label="区域二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="场地"
                prop="market_id"
                :rules="[{ required: true, message: '场地不能为空'}]"
              >
                <el-select v-model="addressForm.market_id" placeholder="请选择场地" size="small">
                  <el-option label="场地一" value="1"></el-option>
                  <el-option label="场地二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="点位"
                prop="point_id"
                :rules="[{ required: true, message: '点位不能为空'}]"
              >
                <el-select v-model="addressForm.point_id" placeholder="请选择点位" size="small">
                  <el-option label="点位一" value="1"></el-option>
                  <el-option label="点位二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" style="width:73%">立即试用</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="product-wrap_content-detail-item">
          <div class="product-wrap_project-name-img">
            <h3 class="product-wrap_project-name">超级英雄</h3>
            <div class="product-wrap_project-img">
              <img src="http://image.xingstation.cn/1007/image/1547450898.jpg">
            </div>
          </div>
          <div class="product-wrap_project-info">
            <div class="product-wrap_project-desc">
              <h4>节目：超级英雄</h4>
              <p>超级英雄节目超级英雄节目超级英雄节目超级英雄节目,超级英雄节目超级英雄节目超级英雄节目超级英雄节,目超级英雄节目超级英雄节目超级英雄节目超级英雄</p>
            </div>
            <div class="product-wrap_skin-desc">
              <h4>皮肤：暖阳色</h4>
              <p>皮肤：暖阳色,皮肤：暖阳色,皮肤：暖阳色</p>
            </div>
          </div>
          <div class="product-wrap-project-address">
            <el-form :model="addressForm" ref="addressForm" label-width="50px">
              <el-form-item
                label="区域"
                prop="area_id"
                :rules="[{ required: true, message: '区域不能为空'}]"
              >
                <el-select v-model="addressForm.area_id" placeholder="请选择区域" size="small">
                  <el-option label="区域一" value="1"></el-option>
                  <el-option label="区域二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="场地"
                prop="market_id"
                :rules="[{ required: true, message: '场地不能为空'}]"
              >
                <el-select v-model="addressForm.market_id" placeholder="请选择场地" size="small">
                  <el-option label="场地一" value="1"></el-option>
                  <el-option label="场地二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="点位"
                prop="point_id"
                :rules="[{ required: true, message: '点位不能为空'}]"
              >
                <el-select v-model="addressForm.point_id" placeholder="请选择点位" size="small">
                  <el-option label="点位一" value="1"></el-option>
                  <el-option label="点位二" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  style="width:73%"
                  @click="submit('addressForm')"
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
import { Form, Option, FormItem, Select, Button } from "element-ui";
import auth from "service/auth";

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
      addressForm: {
        area_id: null,
        point_id: null,
        market_id: null
      },
      img_url: CDN,
      tabKey: 1,
      menu: [
        {
          id: 1,
          name: "解决方案A"
        },
        {
          id: 2,
          name: "解决方案B"
        },
        {
          id: 3,
          name: "解决方案C"
        },
        {
          id: 4,
          name: "解决方案D"
        }
      ]
    };
  },
  methods: {
    tabHandle(val) {
      this.tabKey = val;
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
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
      });
    }
  }
};
</script>
<style lang="less" scoped>
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
      top: 10%;
      left: 5%;
      .product-warp_head-title-item {
        color: #fff;
        font-size: 28px;
        font-weight: 600;
      }
      .product-warp_head-title-item-info {
        color: #fff;
        font-size: 18px;
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
        margin-right: 20px;
        cursor: pointer;
        color: #444;
        font-size: 16px;
        border: 1px solid #ccc;
        &:hover {
          background: #7e58cc;
          opacity: 0.8;
          color: #fff;
          border: 1px solid #7e58cc;
        }
      }
      .is-active {
        background: #7e58cc;
        color: #fff;
      }
    }
    .product-wrap_content-detail {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      .product-wrap_content-detail-item {
        margin-right: auto;
        margin-left: auto;
        margin-bottom: 20px;
        min-width: 1200px;
        max-width: 1200px;
        display: flex;
        flex-direction: row;
        border: 1px solid #ccc;
        .product-wrap_project-name-img {
          padding: 20px;
          width: 20%;
          background: #f9f9fa;
          border-right: 1px solid #ccc;
          .product-wrap_project-name {
            color: #444;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .product-wrap_project-img {
            img {
              width: 45%;
            }
          }
        }
        .product-wrap_project-info {
          padding: 20px;
          border-right: 1px solid #ccc;
          width: 50%;
          color: #444;
          h4 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          p {
            font-size: 14px;
            line-height: 1.5;
          }
        }
        .product-wrap-project-address {
          padding: 20px;
          width: 30%;
          background: #f9f9fa;
        }
      }
    }
  }
}
</style>
